import dayjs from 'dayjs';
import { formatUnits, zeroHash } from 'viem';

import { DECIMALS } from '../../configs/configs';
import {
  ContractsConstants,
  InitialPayloadState,
  InitialProposalState,
  PayloadInitialStruct,
  ProposalInitialStruct,
  ProposalNextState,
  ProposalPendingState,
  ProposalState,
  VMProposalInitialStruct,
  VotingConfig,
} from '../../types';

type FormatProposalParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> &
  Pick<
    VotingConfig,
    'quorum' | 'differential' | 'coolDownBeforeVotingStart'
  > & {
    core: ProposalInitialStruct;
    payloads: PayloadInitialStruct[];
  };

type FormatProposalParamsWithVoting = FormatProposalParams & {
  voting: VMProposalInitialStruct;
};

// universal
export function formatQuorum(
  forVotes: bigint,
  quorum: bigint,
  precisionDivider: bigint,
) {
  const minQuorumVotes = quorum * precisionDivider;
  let quorumReached = false;
  if (forVotes > minQuorumVotes) {
    quorumReached = true;
  }
  return {
    minQuorumVotes,
    quorumReached,
  };
}

export function formatDiff(
  forVotes: bigint,
  againstVotes: bigint,
  differential: bigint,
  precisionDivider: bigint,
) {
  const diff = forVotes - againstVotes;
  const requiredDiff = differential * precisionDivider;
  return { diff, requiredDiff };
}

export function formatPayloadsData({
  payloads,
}: Pick<FormatProposalParams, 'payloads'>) {
  const lastPayloadQueuedAt = Math.max.apply(
    0,
    payloads.map((payload) => payload?.data.queuedAt),
  );

  const firstPayloadQueuedAt = Math.min.apply(
    Math.min.apply(
      0,
      payloads.map((payload) => payload?.data.queuedAt),
    ),
    payloads.map((payload) => payload?.data.queuedAt),
  );

  const lastPayloadExecutedAt = Math.max.apply(
    0,
    payloads.map((payload) => payload?.data.executedAt),
  );

  const lastPayloadCanceledAt = Math.max.apply(
    0,
    payloads.map((payload) => payload?.data.cancelledAt),
  );

  const lastPayloadExpiredAt = Math.max.apply(
    null,
    payloads.map((payload) => {
      if (
        payload.data.queuedAt <= 0 &&
        payload.data.state === InitialPayloadState.Expired
      ) {
        return payload.data.expirationTime;
      } else if (
        payload.data.queuedAt > 0 &&
        payload.data.state === InitialPayloadState.Expired
      ) {
        return (
          payload.data.queuedAt + payload.data.delay + payload.data.gracePeriod
        );
      } else {
        return 0;
      }
    }),
  );

  const predictPayloadExpiredTime = Math.max.apply(
    null,
    payloads.map((payload) => {
      if (
        payload?.data.state &&
        payload.data.state === InitialPayloadState.Created
      ) {
        return payload.data.expirationTime;
      } else if (
        payload?.data.state &&
        payload.data.state === InitialPayloadState.Queued
      ) {
        return (
          payload.data.queuedAt + payload.data.delay + payload.data.gracePeriod
        );
      } else {
        return 0;
      }
    }),
  );

  const allPayloadsExecuted = payloads.every(
    (payload) =>
      payload?.data.state &&
      payload.data.state === InitialPayloadState.Executed,
  );
  const allPayloadsCanceled = payloads.every(
    (payload) =>
      payload?.data.state &&
      payload.data.state === InitialPayloadState.Cancelled,
  );
  const allPayloadsExpired = payloads.every(
    (payload) =>
      payload?.data.state && payload.data.state === InitialPayloadState.Expired,
  );
  // minimal delay from all payloads in proposal for payloads execution estimated status timestamp
  const executionDelay = Math.min.apply(
    null,
    payloads.map((payload) => payload?.data.delay || 0),
  );

  return {
    lastPayloadQueuedAt,
    firstPayloadQueuedAt,
    lastPayloadExecutedAt,
    lastPayloadCanceledAt,
    lastPayloadExpiredAt,
    predictPayloadExpiredTime,
    allPayloadsExecuted,
    allPayloadsCanceled,
    allPayloadsExpired,
    executionDelay,
  };
}

// for proposals with voting data
export function getStatesForActiveProposal({
  ...data
}: Omit<
  FormatProposalParamsWithVoting,
  'coolDownBeforeVotingStart' | 'expirationTime'
>) {
  const now = dayjs().unix();
  const {
    lastPayloadExecutedAt,
    allPayloadsExpired,
    lastPayloadExpiredAt,
    lastPayloadCanceledAt,
    allPayloadsCanceled,
    allPayloadsExecuted,
    lastPayloadQueuedAt,
    firstPayloadQueuedAt,
    predictPayloadExpiredTime,
    executionDelay,
  } = formatPayloadsData({ payloads: data.payloads });
  const {
    core,
    quorum,
    precisionDivider,
    differential,
    cooldownPeriod,
    voting,
  } = data;

  const isVotingStarted = now <= voting.proposalData.endTime;
  const isVotingEnded =
    voting.proposalData.endTime > 0 && now > voting.proposalData.endTime;
  const isVotingClosed =
    voting.proposalData.votingClosedAndSentTimestamp > 0 &&
    now > voting.proposalData.votingClosedAndSentTimestamp;

  const { quorumReached } = formatQuorum(
    voting.proposalData.forVotes,
    quorum,
    precisionDivider,
  );
  const { requiredDiff } = formatDiff(
    voting.proposalData.forVotes,
    voting.proposalData.againstVotes,
    differential,
    precisionDivider,
  );

  const isCanceled =
    core.state === InitialProposalState.Cancelled || allPayloadsCanceled;
  const isExpired =
    core.state === InitialProposalState.Expired || allPayloadsExpired;
  const isVotingActive = isVotingStarted && !isCanceled;
  const isVotingFailed =
    isVotingEnded &&
    (voting.proposalData.againstVotes >= voting.proposalData.forVotes ||
      (voting.proposalData.againstVotes === 0n &&
        voting.proposalData.forVotes === 0n) ||
      !quorumReached ||
      voting.proposalData.forVotes <
        voting.proposalData.againstVotes + requiredDiff);
  const isProposalQueued =
    isVotingEnded &&
    isVotingClosed &&
    voting.proposalData.sentToGovernance &&
    core.queuingTime > 0 &&
    now > core.queuingTime + Number(cooldownPeriod);
  const isProposalExecuted =
    isVotingEnded &&
    isVotingClosed &&
    !isVotingFailed &&
    core.state === InitialProposalState.Executed &&
    !isCanceled;
  const isPayloadsQueued =
    isProposalExecuted && now > lastPayloadQueuedAt + executionDelay;
  const isPayloadsExecuted =
    isVotingEnded &&
    isVotingClosed &&
    !isVotingFailed &&
    core.state === InitialProposalState.Executed &&
    !isCanceled &&
    allPayloadsExecuted &&
    !isExpired;

  let isProposalActive = true;
  if (
    core.state === InitialProposalState.Null ||
    core.state === InitialProposalState.Created
  ) {
    isProposalActive = false;
  } else if (isCanceled) {
    isProposalActive = false;
  } else if (isVotingFailed) {
    isProposalActive = false;
  } else if (isPayloadsExecuted) {
    isProposalActive = false;
  } else if (isExpired) {
    isProposalActive = false;
  }

  return {
    isVotingStarted,
    isVotingActive,
    isVotingEnded,
    isVotingClosed,
    isVotingFailed,
    lastPayloadQueuedAt,
    firstPayloadQueuedAt,
    lastPayloadCanceledAt,
    lastPayloadExecutedAt,
    lastPayloadExpiredAt,
    predictPayloadExpiredTime,
    allPayloadsExecuted,
    allPayloadsCanceled,
    allPayloadsExpired,
    isCanceled,
    isExpired,
    isProposalActive,
    isProposalQueued,
    isProposalExecuted,
    isPayloadsQueued,
    isPayloadsExecuted,
    executionDelay,
  };
}

export function getStateAndTimestampForActiveProposal({
  ...data
}: Omit<FormatProposalParamsWithVoting, 'coolDownBeforeVotingStart'>) {
  const {
    isVotingActive,
    isVotingEnded,
    isVotingFailed,
    isExpired,
    allPayloadsExecuted,
    isCanceled,
    isPayloadsExecuted,
    lastPayloadCanceledAt,
    allPayloadsExpired,
    lastPayloadExpiredAt,
    lastPayloadExecutedAt,
  } = getStatesForActiveProposal(data);
  const {
    quorum,
    precisionDivider,
    differential,
    core,
    voting,
    expirationTime,
  } = data;

  const { quorumReached } = formatQuorum(
    voting.proposalData.forVotes,
    quorum,
    precisionDivider,
  );
  const { requiredDiff } = formatDiff(
    voting.proposalData.forVotes,
    voting.proposalData.againstVotes,
    differential,
    precisionDivider,
  );

  if (
    !isCanceled &&
    voting.proposalData.startTime === 0 &&
    core.state <= InitialProposalState.Active
  ) {
    return {
      state: ProposalState.Created,
      timestamp: core.creationTime,
    };
  } else if (isVotingActive && core.snapshotBlockHash !== zeroHash) {
    return {
      state: ProposalState.Voting,
      timestamp: core.votingActivationTime,
    };
  } else if (
    isVotingEnded &&
    !isCanceled &&
    voting.proposalData.forVotes >
      voting.proposalData.againstVotes + requiredDiff &&
    quorumReached &&
    !allPayloadsExecuted &&
    !isExpired
  ) {
    return {
      state: ProposalState.Succeed,
      timestamp: voting.proposalData.endTime,
    };
  } else if (isVotingFailed && !isCanceled) {
    return {
      state: ProposalState.Failed,
      timestamp: voting.proposalData.endTime,
    };
  } else if (isCanceled) {
    return {
      state: ProposalState.Canceled,
      timestamp:
        lastPayloadCanceledAt > core.cancelTimestamp
          ? lastPayloadCanceledAt
          : core.cancelTimestamp,
    };
  } else if (isPayloadsExecuted) {
    return {
      state: ProposalState.Executed,
      timestamp: lastPayloadExecutedAt,
    };
  } else {
    return {
      state: ProposalState.Expired,
      timestamp:
        core.state === ProposalState.Executed && allPayloadsExpired
          ? lastPayloadExpiredAt
          : core.creationTime + Number(expirationTime),
    };
  }
}

export function getNextStateAndTimestampForActiveProposal({
  ...data
}: FormatProposalParamsWithVoting & {
  forVoteS?: bigint;
  againstVoteS?: bigint;
}) {
  const now = dayjs().unix();
  const {
    isVotingStarted,
    isVotingEnded,
    isVotingClosed,
    firstPayloadQueuedAt,
    predictPayloadExpiredTime,
    executionDelay,
  } = getStatesForActiveProposal(data);
  const {
    forVoteS,
    againstVoteS,
    voting,
    quorum,
    precisionDivider,
    differential,
    core,
    cooldownPeriod,
    coolDownBeforeVotingStart,
    expirationTime,
  } = data;

  const forVotes = forVoteS ?? voting.proposalData.forVotes;
  const againstVotes = againstVoteS ?? voting.proposalData.againstVotes;

  const { quorumReached } = formatQuorum(forVotes, quorum, precisionDivider);
  const { requiredDiff } = formatDiff(
    forVotes,
    againstVotes,
    differential,
    precisionDivider,
  );

  const isVotingDefeated =
    againstVotes >= forVotes ||
    (againstVotes === 0n && forVotes === 0n) ||
    !quorumReached;

  const isProposalWaitForQueued =
    isVotingEnded &&
    isVotingClosed &&
    !isVotingDefeated &&
    voting.proposalData.sentToGovernance &&
    core.queuingTime > 0 &&
    now < core.queuingTime + Number(cooldownPeriod);

  const isPayloadsWaitForQueued =
    core.state === InitialProposalState.Executed &&
    now < firstPayloadQueuedAt + executionDelay;

  const executedTimestamp =
    core.queuingTime > 0 && firstPayloadQueuedAt === 0
      ? core.queuingTime + Number(cooldownPeriod)
      : core.queuingTime > 0 && firstPayloadQueuedAt > 0
        ? firstPayloadQueuedAt + executionDelay
        : 0;

  if (now <= core.creationTime + coolDownBeforeVotingStart) {
    return {
      state: ProposalNextState.Voting,
      timestamp: core.creationTime + coolDownBeforeVotingStart,
    };
  } else if (
    isVotingStarted &&
    !isVotingEnded &&
    forVotes > againstVotes + requiredDiff &&
    quorumReached
  ) {
    return {
      state: ProposalNextState.Succeed,
      timestamp: voting.proposalData.endTime,
    };
  } else if (isVotingDefeated && isVotingStarted && !isVotingEnded) {
    return {
      state: ProposalNextState.Failed,
      timestamp: voting.proposalData.endTime,
    };
  } else if (isProposalWaitForQueued && !isPayloadsWaitForQueued) {
    return {
      state: ProposalNextState.ProposalExecuted,
      timestamp: executedTimestamp,
    };
  } else if (isPayloadsWaitForQueued) {
    return {
      state: ProposalNextState.PayloadsExecuted,
      timestamp: executedTimestamp,
    };
  } else {
    return {
      state: ProposalNextState.Expired,
      timestamp:
        core.state === InitialProposalState.Executed
          ? predictPayloadExpiredTime
          : core.creationTime + Number(expirationTime),
    };
  }
}

export function getPendingStateForActiveProposal({
  ...data
}: FormatProposalParamsWithVoting) {
  const now = dayjs().unix();
  const {
    isVotingStarted,
    isVotingEnded,
    isVotingClosed,
    isVotingFailed,
    isProposalExecuted,
    isProposalQueued,
    isPayloadsQueued,
    lastPayloadQueuedAt,
  } = getStatesForActiveProposal(data);
  const { core, coolDownBeforeVotingStart, voting } = data;

  if (!isVotingFailed) {
    if (
      now > core.creationTime + coolDownBeforeVotingStart &&
      !isVotingStarted &&
      !isVotingEnded &&
      !isVotingClosed
    ) {
      return ProposalPendingState.WaitForActivateVoting;
    } else if (
      isVotingEnded &&
      !isVotingClosed &&
      !voting.proposalData.sentToGovernance
    ) {
      return ProposalPendingState.WaitForCloseVoting;
    } else if (
      isVotingEnded &&
      !isVotingClosed &&
      voting.proposalData.sentToGovernance &&
      core.queuingTime <= 0n
    ) {
      return ProposalPendingState.WaitForQueueProposal;
    } else if (
      isProposalQueued &&
      core.state !== InitialProposalState.Executed
    ) {
      return ProposalPendingState.WaitForExecuteProposal;
    } else if (isProposalExecuted && lastPayloadQueuedAt === 0) {
      return ProposalPendingState.WaitForQueuePayloads;
    } else if (isPayloadsQueued) {
      return ProposalPendingState.WaitForExecutePayloads;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function formatActiveProposalData({
  ...data
}: FormatProposalParamsWithVoting & {
  title?: string;
}) {
  const { isVotingActive } = getStatesForActiveProposal(data);
  const state = getStateAndTimestampForActiveProposal(data);
  const nextState = getNextStateAndTimestampForActiveProposal(data);
  const pendingState = getPendingStateForActiveProposal(data);
  const { core, voting, differential, precisionDivider, quorum, title } = data;

  const { minQuorumVotes } = formatQuorum(
    voting.proposalData.forVotes,
    quorum,
    precisionDivider,
  );
  const { requiredDiff } = formatDiff(
    voting.proposalData.forVotes,
    voting.proposalData.againstVotes,
    differential,
    precisionDivider,
  );

  const allVotes =
    voting.proposalData.forVotes + voting.proposalData.againstVotes;

  const requiredForVotes =
    voting.proposalData.againstVotes + requiredDiff < minQuorumVotes
      ? minQuorumVotes
      : voting.proposalData.againstVotes + requiredDiff;
  const forPercent =
    allVotes > 0n
      ? (voting.proposalData.forVotes / requiredForVotes) * 100n
      : 0;

  const requiredAgainstVotes =
    voting.proposalData.forVotes === 0n ||
    voting.proposalData.forVotes - requiredDiff <= 0n ||
    voting.proposalData.forVotes < minQuorumVotes
      ? minQuorumVotes
      : voting.proposalData.forVotes - requiredDiff;

  const againstPercent =
    allVotes > 0n
      ? (voting.proposalData.againstVotes /
          (requiredAgainstVotes > 0n ? requiredAgainstVotes : 1n)) *
        100n
      : 0;

  return {
    proposalId: Number(voting.proposalData.id),
    title: title ?? `Proposal ${voting.proposalData.id}`,
    state,
    ipfsHash: core.ipfsHash,
    nextState,
    pendingState,
    votingChainId: voting.votingChainId,
    snapshotBlockHash: core.snapshotBlockHash,
    votingAssets: voting.votingAssets as string[],
    isVotingActive,
    isVotingFinished: state.state > ProposalState.Voting,
    isFinished: state.state > ProposalState.Succeed,
    // votes
    forVotes: +formatUnits(voting.proposalData.forVotes, DECIMALS),
    requiredForVotes: +formatUnits(requiredForVotes, DECIMALS),
    forPercent: +Number(forPercent).toFixed(4),
    againstVotes: +formatUnits(voting.proposalData.againstVotes, DECIMALS),
    requiredAgainstVotes: +formatUnits(requiredAgainstVotes, DECIMALS),
    againstPercent: +Number(againstPercent).toFixed(4),
    // ipfs
    ipfsError: core.ipfsError,
  };
}

// only for finished proposals
export function getStateAndTimestampForFinishedProposal({
  ...data
}: FormatProposalParams) {
  const {
    lastPayloadExecutedAt,
    allPayloadsExpired,
    lastPayloadExpiredAt,
    lastPayloadCanceledAt,
    allPayloadsCanceled,
    allPayloadsExecuted,
  } = formatPayloadsData({ payloads: data.payloads });
  const {
    core,
    quorum,
    precisionDivider,
    differential,
    coolDownBeforeVotingStart,
    expirationTime,
  } = data;

  const { quorumReached } = formatQuorum(
    core.forVotes,
    quorum,
    precisionDivider,
  );
  const { requiredDiff } = formatDiff(
    core.forVotes,
    core.againstVotes,
    differential,
    precisionDivider,
  );

  const isCanceled =
    core.state === InitialProposalState.Cancelled || allPayloadsCanceled;
  const isExpired =
    core.state === InitialProposalState.Expired || allPayloadsExpired;
  const isVotingFailed =
    core.againstVotes >= core.forVotes ||
    (core.againstVotes === 0n && core.forVotes === 0n) ||
    !quorumReached ||
    core.forVotes < core.againstVotes + requiredDiff;
  const isPayloadsExecuted =
    !isVotingFailed &&
    core.state === InitialProposalState.Executed &&
    !isCanceled &&
    allPayloadsExecuted &&
    !isExpired;

  let proposalState = ProposalState.Created;
  if (isVotingFailed && !isCanceled) {
    proposalState = ProposalState.Failed;
  } else if (isCanceled) {
    proposalState = ProposalState.Canceled;
  } else if (isPayloadsExecuted) {
    proposalState = ProposalState.Executed;
  } else {
    proposalState = ProposalState.Expired;
  }

  let finishedTimestamp = core.creationTime;
  if (proposalState === ProposalState.Failed) {
    finishedTimestamp =
      core.creationTime + coolDownBeforeVotingStart + core.votingDuration;
  } else if (proposalState === ProposalState.Executed) {
    finishedTimestamp = lastPayloadExecutedAt;
  } else if (proposalState === ProposalState.Canceled) {
    finishedTimestamp =
      lastPayloadCanceledAt > core.cancelTimestamp
        ? lastPayloadCanceledAt
        : core.cancelTimestamp;
  } else if (
    core.state === InitialProposalState.Executed &&
    allPayloadsExpired
  ) {
    finishedTimestamp = lastPayloadExpiredAt;
  } else {
    finishedTimestamp = core.creationTime + Number(expirationTime);
  }

  return {
    proposalState,
    finishedTimestamp,
  };
}
