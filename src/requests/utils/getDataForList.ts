import { IVotingPortal_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import {
  GetPayloadsData,
  InitialPayloadState,
  InitialProposalState,
  PayloadInitialStruct,
  ProposalInitialStruct,
} from '../../types';
import { FetchProposalsDataForListParams } from '../fetchProposalsDataForList';
import {
  formatActiveProposalData,
  getStateAndTimestampForFinishedProposal,
} from './formatProposalData';
import { getVotingData } from './getVotingData';

export async function getDataForList({
  input,
  proposals,
  getPayloadsData,
}: {
  input: FetchProposalsDataForListParams;
  proposals: ProposalInitialStruct[];
  getPayloadsData: ({
    chainId,
    payloadsIds,
    clients,
  }: GetPayloadsData & { clients: Record<number, Client> }) => Promise<
    PayloadInitialStruct[]
  >;
}) {
  const { clients, userAddress, representativeAddress, votingConfigs } = input;

  const proposalsData = proposals.sort((a, b) => b.id - a.id);

  const payloadsChainsWithIds: Record<number, number[]> = {};
  const initialPayloads = proposalsData
    .map((proposal) => {
      return proposal.payloads;
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
            clients,
          }),
      ),
    )
  ).flat();

  const proposalsWithPayloads = proposalsData.map((proposal) => {
    const proposalPayloads = proposal.payloads.map((payload) => {
      return payloadsData.filter(
        (p) =>
          Number(p.id) === Number(payload.payloadId) &&
          Number(p.chain) === Number(payload.chain) &&
          p.payloadsController === payload.payloadsController,
      )[0];
    });
    const isProposalPayloadsFinished = proposalPayloads.every(
      (payload) => payload && payload?.data.state > InitialPayloadState.Queued,
    );
    return {
      proposal: {
        ...proposal,
        isFinished:
          proposal.state === InitialProposalState.Executed
            ? isProposalPayloadsFinished
            : proposal.state > InitialProposalState.Executed,
      },
      payloads: proposalPayloads,
    };
  });

  const activeIds = proposalsWithPayloads
    .filter((item) => !item.proposal.isFinished)
    .map((item) => item.proposal.id);
  const finishedIds = proposalsWithPayloads
    .filter((item) => item.proposal.isFinished)
    .map((item) => item.proposal.id);

  const proposalsForGetVotingData = await Promise.all(
    activeIds.map(async (id) => {
      const proposal = proposalsWithPayloads.filter(
        (item) => item.proposal.id === id,
      )[0].proposal;
      const votingChainId = await readContract(
        clients[appConfig.govCoreChainId],
        {
          abi: IVotingPortal_ABI,
          address: proposal.votingPortal,
          functionName: 'VOTING_MACHINE_CHAIN_ID',
          args: [],
        },
      );
      return {
        id: BigInt(proposal.id),
        votingChainId: Number(votingChainId),
        snapshotBlockHash: proposal.snapshotBlockHash,
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
              (item) => item.proposal.id === id,
            )[0];
            const votingData = votingProposalsData.filter(
              (data) => data.proposalData.id === BigInt(id),
            )[0];
            const votingConfig = votingConfigs.filter(
              (config) => config.accessLevel === data.proposal.accessLevel,
            )[0];
            return formatActiveProposalData({
              ...input,
              ...votingConfig,
              core: data.proposal,
              payloads: data.payloads,
              voting: votingData,
              title: data.proposal?.title,
            });
          }),
        )
      : [];

  const finishedProposalsData = finishedIds.map((id) => {
    const data = proposalsWithPayloads.filter(
      (item) => item.proposal.id === id,
    )[0];
    const votingConfig = votingConfigs.filter(
      (config) => config.accessLevel === data.proposal.accessLevel,
    )[0];
    const { proposalState, finishedTimestamp } =
      getStateAndTimestampForFinishedProposal({
        ...input,
        ...votingConfig,
        core: data.proposal,
        payloads: data.payloads,
      });
    return {
      proposalId: Number(data.proposal.id),
      title: data.proposal?.title ?? `Proposal #${data.proposal.id}`,
      ipfsHash: data.proposal.ipfsHash,
      state: {
        state: proposalState,
        timestamp: finishedTimestamp,
      },
    };
  });

  return {
    activeProposalsData,
    finishedProposalsData,
  };
}
