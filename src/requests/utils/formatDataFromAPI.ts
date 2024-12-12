import { zeroAddress, zeroHash } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { ipfsGateway } from '../../configs/configs';
import { getProposalMetadata } from '../../helpers/getProposalMetadata';
import { texts } from '../../helpers/texts/texts';
import {
  GetGovernanceProposalsResponse,
  GetProposalInitialResponse,
  InitialPayloadState,
  InitialProposalState,
} from '../../types';
import { FetchProposalsDataForListParams } from '../fetchProposalsDataForList';
import { getDataForList, getProposalsWithPayloads } from './getDataForList';

export function getProposalFormattedData(proposal: GetProposalInitialResponse) {
  return {
    ...proposal,
    votingActivationTime: proposal.votingActivationTime ?? 0,
    queuingTime: proposal.queuingTime ?? 0,
    cancelTimestamp: proposal.cancelTimestamp ?? 0,
    executedTimestamp: proposal.executedTimestamp ?? 0,
    failedTimestamp: proposal.failedTimestamp ?? 0,
    id: proposal.proposalId,
    title: proposal.title ?? `Proposal ${proposal.proposalId}`,
    ipfsError: '',
    forVotes: BigInt(proposal.forVotes ?? 0),
    againstVotes: BigInt(proposal.againstVotes ?? 0),
    cancellationFee: BigInt(proposal.cancellationFee ?? 0),
    payloads: proposal.payloads.map((payload) => {
      return {
        accessLevel: payload.maximumAccessLevelRequired,
        payloadId: payload.payloadId,
        chain: BigInt(payload.chainId ?? 1),
        payloadsController: payload.payloadsController,
      };
    }),
  };
}

export async function getProposalForListFormattedData(
  proposal: GetProposalInitialResponse,
) {
  let title = proposal.title;
  let ipfsError = '';

  const isProposalPayloadsFinished = (proposal.payloads ?? []).every(
    (payload) => payload && payload?.state > InitialPayloadState.Queued,
  );

  const isFinished =
    proposal.state === InitialProposalState.Executed
      ? isProposalPayloadsFinished
      : proposal.state > InitialProposalState.Executed;

  if (typeof title !== 'string' && !isFinished) {
    try {
      const proposalMetadata = await getProposalMetadata(
        proposal.ipfsHash,
        ipfsGateway,
      );
      title = proposalMetadata.title;
    } catch (e) {
      ipfsError = texts.other.fetchFromIpfsError;
      console.error('Error getting ipfs data', e);
    }
  }

  const data = getProposalFormattedData(proposal);

  return {
    ...data,
    title: title as string,
    ipfsError,
  };
}

export function getProposalPayloadsFormattedData(
  proposal: GetProposalInitialResponse,
) {
  return proposal.payloads.map((payload) => {
    return {
      id: BigInt(payload.payloadId ?? 0),
      chain: BigInt(payload.chainId ?? 1),
      payloadsController: payload.payloadsController,
      data: {
        ...payload,
        expirationTime: payload.expirationTime ?? 0,
        executedAt: payload.executedAt ?? 0,
        cancelledAt: payload.cancelledAt ?? 0,
        queuedAt: payload.queuedAt ?? 0,
        actions: [],
      },
    };
  });
}

export function getProposalVotingFormattedData(
  proposal: GetProposalInitialResponse,
) {
  return {
    proposalData: {
      id: BigInt(proposal.proposalId),
      sentToGovernance: proposal.sentToGovernance ?? false,
      startTime: proposal.votingStartTime ?? 0,
      endTime: proposal.votingEndTime ?? 0,
      votingClosedAndSentTimestamp: proposal.votingClosedAndSentTimestamp ?? 0,
      forVotes: BigInt(proposal.votingForVotes ?? 0),
      againstVotes: BigInt(proposal.votingAgainstVotes ?? 0),
      creationBlockNumber: BigInt(proposal.votingCreationBlockNumber ?? 0),
      votingClosedAndSentBlockNumber: BigInt(
        proposal.votingClosedAndSentBlockNumber ?? 0,
      ),
    },
    hasRequiredRoots: proposal.hasRequiredRoots ?? false,
    votingChainId: proposal.votingChainId,
    state: proposal.votingProposalState ?? 0,
    // TODO:
    strategy: zeroAddress,
    dataWarehouse: zeroAddress,
    votingAssets: [
      appConfig.additional.aaveAddress,
      appConfig.additional.aAaveAddress,
      appConfig.additional.stkAAVEAddress,
    ],
    //
    votedInfo: {
      support: false,
      votingPower: 0n,
    },
    voteConfig: {
      l1ProposalBlockHash: proposal.l1ProposalBlockHash ?? zeroHash,
      votingDuration: proposal.votingDuration ?? 0,
    },
  };
}

export async function formatListData(
  input: Omit<FetchProposalsDataForListParams, 'clients'>,
  data: Omit<GetGovernanceProposalsResponse, 'totalProposalsCount'>,
) {
  const proposalsData = await Promise.all(
    data.proposals.map(
      async (proposal) => await getProposalForListFormattedData(proposal),
    ),
  );
  const payloadsData = data.proposals
    .map((proposal) => getProposalPayloadsFormattedData(proposal))
    .flat();
  const proposalsWithPayloads = getProposalsWithPayloads({
    proposalsData,
    payloadsData,
  });
  const voting = data.proposals.map((proposal) =>
    getProposalVotingFormattedData(proposal),
  );

  return getDataForList({
    input,
    ...proposalsWithPayloads,
    voting,
  });
}
