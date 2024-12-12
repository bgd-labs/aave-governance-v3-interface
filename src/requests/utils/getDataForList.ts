import {
  ActiveProposalOnTheList,
  InitialPayloadState,
  InitialProposalState,
  PayloadInitialStruct,
  ProposalInitialStruct,
  ProposalOnTheList,
  VMProposalInitialStruct,
} from '../../types';
import { FetchProposalsDataForListParams } from '../fetchProposalsDataForList';
import {
  formatActiveProposalData,
  getStateAndTimestampForFinishedProposal,
} from './formatProposalData';

export function getProposalsWithPayloads({
  proposalsData,
  payloadsData,
}: {
  proposalsData: ProposalInitialStruct[];
  payloadsData: PayloadInitialStruct[];
}) {
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

  return {
    proposalsWithPayloads,
    activeIds,
    finishedIds,
  };
}

export function getDataForList({
  input,
  proposalsWithPayloads,
  activeIds,
  finishedIds,
  voting,
}: {
  input: Omit<FetchProposalsDataForListParams, 'clients'>;
  proposalsWithPayloads: {
    proposal: ProposalInitialStruct;
    payloads: PayloadInitialStruct[];
  }[];
  activeIds: number[];
  finishedIds: number[];
  voting: Omit<VMProposalInitialStruct, 'strategy' | 'dataWarehouse'>[];
}): {
  activeProposalsData: ActiveProposalOnTheList[];
  finishedProposalsData: ProposalOnTheList[];
} {
  const { votingConfigs } = input;

  const activeProposalsData = activeIds.map((id) => {
    const data = proposalsWithPayloads.filter(
      (item) => item.proposal.id === id,
    )[0];
    const votingData = voting.filter(
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
  });

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
