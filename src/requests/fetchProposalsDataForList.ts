import { IVotingPortal_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../configs/appConfig';
import {
  ContractsConstants,
  InitialPayloadState,
  InitialProposalState,
  VotingConfig,
} from '../types';
import {
  formatActiveProposalData,
  getStateAndTimestampForFinishedProposal,
} from './utils/formatProposalData';
import { getPayloadsData } from './utils/getPayloadsData';
import { GetProposalsData, getProposalsData } from './utils/getProposalsData';
import { getVotingData } from './utils/getVotingData';

export type FetchProposalsDataForListParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> &
  GetProposalsData & {
    votingConfigs: VotingConfig[];
    userAddress?: string;
    representativeAddress?: string;
    clients: Record<number, Client>;
  };

export async function fetchProposalsDataForList({
  input,
}: {
  input: FetchProposalsDataForListParams;
}) {
  const { clients, userAddress, representativeAddress, votingConfigs } = input;

  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposals data from API, using RPC fallback',
      e,
    );
    const proposalsData = (await getProposalsData(input)).sort(
      (a, b) => b.proposal.id - a.proposal.id,
    );

    const payloadsChainsWithIds: Record<number, number[]> = {};
    const initialPayloads = proposalsData
      .map((proposal) => {
        return proposal.proposal.payloads;
      })
      .flat();
    const payloadsChains = initialPayloads
      .map((payload) => payload.chain)
      .filter((value, index, self) => self.indexOf(value) === index);
    payloadsChains.forEach((chainId) => {
      payloadsChainsWithIds[Number(chainId)] = initialPayloads
        .filter((payload) => Number(payload.chain) === Number(chainId))
        .map((payload) => payload.payloadId)
        .filter((value, index, self) => self.indexOf(value) === index);
    });
    const payloadsData = (
      await Promise.all(
        Object.entries(payloadsChainsWithIds).map(
          async ([chainId, payloadsIds]) =>
            await getPayloadsData({
              chainId: Number(chainId),
              payloadsIds,
            }),
        ),
      )
    ).flat();

    const proposalsWithPayloads = proposalsData.map((proposal) => {
      const proposalPayloads = proposal.proposal.payloads.map((payload) => {
        return payloadsData.filter(
          (p) =>
            Number(p.payload.id) === Number(payload.payloadId) &&
            Number(p.payload.data.chain) === Number(payload.chain) &&
            p.payload.data.payloadsController === payload.payloadsController,
        )[0];
      });
      const isProposalPayloadsFinished = proposalPayloads.every(
        (payload) =>
          payload && payload?.payload.data.state > InitialPayloadState.Queued,
      );
      return {
        proposal: {
          ...proposal,
          isFinished:
            proposal.proposal.state === InitialProposalState.Executed
              ? isProposalPayloadsFinished
              : proposal.proposal.state > InitialProposalState.Executed,
        },
        payloads: proposalPayloads,
      };
    });

    const activeIds = proposalsWithPayloads
      .filter((item) => !item.proposal.isFinished)
      .map((item) => item.proposal.proposal.id);
    const finishedIds = proposalsWithPayloads
      .filter((item) => item.proposal.isFinished)
      .map((item) => item.proposal.proposal.id);

    const proposalsForGetVotingData = await Promise.all(
      activeIds.map(async (id) => {
        const proposal = proposalsWithPayloads.filter(
          (item) => item.proposal.proposal.id === id,
        )[0].proposal;
        const votingChainId = await readContract(
          clients[appConfig.govCoreChainId],
          {
            abi: IVotingPortal_ABI,
            address: proposal.proposal.votingPortal,
            functionName: 'VOTING_MACHINE_CHAIN_ID',
            args: [],
          },
        );
        return {
          id: BigInt(proposal.proposal.id),
          votingChainId: Number(votingChainId),
          snapshotBlockHash: proposal.proposal.snapshotBlockHash,
        };
      }),
    );

    const votingProposalsData =
      proposalsForGetVotingData.length > 0
        ? await getVotingData({
            initialProposals: proposalsForGetVotingData,
            userAddress,
            representativeAddress,
            clients,
          })
        : [];

    const activeProposalsData =
      activeIds.length > 0
        ? await Promise.all(
            activeIds.map(async (id) => {
              const data = proposalsWithPayloads.filter(
                (item) => item.proposal.proposal.id === id,
              )[0];
              const votingData = votingProposalsData.filter(
                (data) => data.proposalData.id === BigInt(id),
              )[0];
              const votingConfig = votingConfigs.filter(
                (config) =>
                  config.accessLevel === data.proposal.proposal.accessLevel,
              )[0];
              return formatActiveProposalData({
                ...input,
                ...votingConfig,
                core: data.proposal.proposal,
                payloads: data.payloads.map((payload) => payload.payload),
                voting: votingData,
                title: data.proposal.ipfs?.title,
              });
            }),
          )
        : [];

    const finishedProposalsData = finishedIds.map((id) => {
      const data = proposalsWithPayloads.filter(
        (item) => item.proposal.proposal.id === id,
      )[0];
      const votingConfig = votingConfigs.filter(
        (config) => config.accessLevel === data.proposal.proposal.accessLevel,
      )[0];
      const { proposalState, finishedTimestamp } =
        getStateAndTimestampForFinishedProposal({
          ...input,
          ...votingConfig,
          core: data.proposal.proposal,
          payloads: data.payloads.map((payload) => payload.payload),
        });
      return {
        proposalId: Number(data.proposal.proposal.id),
        title:
          data.proposal.ipfs?.title ?? `Proposal #${data.proposal.proposal.id}`,
        ipfsHash: data.proposal.proposal.ipfsHash,
        state: {
          state: proposalState,
          timestamp: finishedTimestamp,
        },
      };
    });

    return {
      activeIds,
      activeProposalsData,
      finishedIds,
      finishedProposalsData,
    };
  }
}
