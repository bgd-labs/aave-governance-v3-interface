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
    const proposalsData = await getProposalsData(input);

    const payloadsChainsWithIds: Record<number, number[]> = {};
    const initialPayloads = proposalsData
      .map((proposal) => {
        return proposal.proposalData.payloads;
      })
      .flat();
    const payloadsChains = initialPayloads
      .map((payload) => payload.chain)
      .filter((value, index, self) => self.indexOf(value) === index);
    payloadsChains.forEach((chainId) => {
      payloadsChainsWithIds[Number(chainId)] = initialPayloads
        .filter((payload) => payload.chain === BigInt(chainId))
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
      const proposalPayloads = proposal.proposalData.payloads.map((payload) => {
        return payloadsData.filter(
          (p) =>
            Number(p.id) === payload.payloadId &&
            p.chain === payload.chain &&
            p.payloadsController === payload.payloadsController,
        )[0];
      });
      const isProposalPayloadsFinished = proposalPayloads.every(
        (payload) =>
          payload && payload?.data.state > InitialPayloadState.Queued,
      );
      return {
        proposal: {
          ...proposal,
          isFinished:
            proposal.proposalData.state === InitialProposalState.Executed
              ? isProposalPayloadsFinished
              : proposal.proposalData.state > InitialProposalState.Executed,
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

    const proposalsForGetVotingData = activeIds.map((id) => {
      const proposal = proposalsWithPayloads.filter(
        (item) => item.proposal.id === id,
      )[0].proposal;
      return {
        id: proposal.id,
        votingChainId: Number(proposal.votingChainId),
        snapshotBlockHash: proposal.proposalData.snapshotBlockHash,
      };
    });

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
                (data) => data.proposalData.id === id,
              )[0];
              const votingConfig = votingConfigs.filter(
                (config) =>
                  config.accessLevel === data.proposal.proposalData.accessLevel,
              )[0];
              return formatActiveProposalData({
                ...input,
                ...votingConfig,
                core: data.proposal,
                payloads: data.payloads,
                voting: votingData,
              });
            }),
          )
        : [];

    const finishedProposalsData = finishedIds.map((id) => {
      const data = proposalsWithPayloads.filter(
        (item) => item.proposal.id === id,
      )[0];
      const votingConfig = votingConfigs.filter(
        (config) =>
          config.accessLevel === data.proposal.proposalData.accessLevel,
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
        title: `Proposal ${data.proposal.id}`, // TODO: should be proposal title
        ipfsHash: data.proposal.proposalData.ipfsHash,
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
