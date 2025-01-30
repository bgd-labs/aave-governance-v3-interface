import { texts } from '../../../helpers/texts/texts';
import { ProposalStateWithName } from '../../../types';
import { TimelineItemType, TimelineItemTypeType } from './types';

export function getVotingClosedState({
  now,
  votingClosedTimestamp,
  canceledTimestamp,
  isExecuted,
  state,
}: {
  now: number;
  votingClosedTimestamp: number;
  canceledTimestamp?: number;
  isExecuted: boolean;
  state: ProposalStateWithName;
}) {
  if (now >= votingClosedTimestamp || !!canceledTimestamp) {
    if (isExecuted || state === ProposalStateWithName.Succeed) {
      return ProposalStateWithName.Succeed;
    } else if (state === ProposalStateWithName.Failed) {
      return ProposalStateWithName.Failed;
    }
  } else {
    return undefined;
  }
}

export function getPosition(now: number, start: number, end: number) {
  return ((now - start) / (end - start)) * 100;
}

export function getOpenToVoteTimestamp({
  now,
  coolDownBeforeVotingStart,
  votingStartTime,
  proposalCreationTime,
}: {
  now: number;
  coolDownBeforeVotingStart: number;
  votingStartTime: number;
  proposalCreationTime: number;
}) {
  if (votingStartTime > 0) {
    return votingStartTime;
  } else if (now > proposalCreationTime + coolDownBeforeVotingStart) {
    return now + 60;
  } else {
    return proposalCreationTime + coolDownBeforeVotingStart;
  }
}

export function getVotingClosedTimestamp({
  now,
  votingClosedAndSentTimestamp,
  votingEndTime,
  sentToGovernance,
  isFinished,
  votingDuration,
  openToVoteTimestamp,
}: {
  now: number;
  votingClosedAndSentTimestamp: number;
  votingEndTime: number;
  sentToGovernance: boolean;
  isFinished: boolean;
  openToVoteTimestamp: number;
  votingDuration: number;
}) {
  if (votingClosedAndSentTimestamp > 0) {
    return votingClosedAndSentTimestamp;
  } else if (
    (votingEndTime > 0 && sentToGovernance) ||
    (votingEndTime > 0 && now < votingEndTime) ||
    (votingEndTime > 0 && isFinished)
  ) {
    return votingEndTime;
  } else if (votingEndTime > 0 && now > votingEndTime) {
    return now + 60;
  } else {
    return openToVoteTimestamp + votingDuration;
  }
}

export function getFinishedTimestamp({
  now,
  lastPayloadQueuedAt,
  lastPayloadExecutedAt,
  openToVoteTimestamp,
  payloadsExecutionDelay,
  votingDuration,
  queuingTime,
  votingClosedAndSentTimestamp,
  votingEndTime,
}: {
  now: number;
  lastPayloadExecutedAt: number;
  lastPayloadQueuedAt: number;
  openToVoteTimestamp: number;
  payloadsExecutionDelay: number;
  votingDuration: number;
  queuingTime: number;
  votingClosedAndSentTimestamp: number;
  votingEndTime: number;
}) {
  const isPayloadsReadyForExecution =
    lastPayloadQueuedAt > 0 &&
    lastPayloadExecutedAt === 0 &&
    lastPayloadQueuedAt + payloadsExecutionDelay < now;

  const isPayloadsQueuing =
    lastPayloadQueuedAt > 0 &&
    lastPayloadExecutedAt === 0 &&
    lastPayloadQueuedAt + payloadsExecutionDelay > now;

  if (lastPayloadExecutedAt > 0) {
    return lastPayloadExecutedAt;
  } else if (isPayloadsReadyForExecution) {
    return now + 60;
  } else if (isPayloadsQueuing) {
    return lastPayloadQueuedAt + payloadsExecutionDelay;

    // if proposal queued but not executed
  } else if (queuingTime > 0 && lastPayloadQueuedAt === 0) {
    return queuingTime + payloadsExecutionDelay;

    // if voting results sent but proposal not start queuing and now time > than predict time
  } else if (
    votingClosedAndSentTimestamp > 0 &&
    lastPayloadExecutedAt <= 0 &&
    votingClosedAndSentTimestamp + payloadsExecutionDelay < now
  ) {
    return now + 60;

    // if voting results sent but proposal not start queuing
  } else if (
    votingClosedAndSentTimestamp > 0 &&
    lastPayloadExecutedAt <= 0 &&
    votingClosedAndSentTimestamp + payloadsExecutionDelay > now
  ) {
    return votingClosedAndSentTimestamp + payloadsExecutionDelay;

    // if voting end but results not send to gov core yet
  } else if (votingEndTime > 0 && lastPayloadExecutedAt === 0) {
    return votingEndTime + payloadsExecutionDelay;

    // if voting start but not finished yet
  } else {
    return openToVoteTimestamp + votingDuration + payloadsExecutionDelay;
  }
}

export function generateTimelinePositions({
  now,
  createdTimestamp,
  openToVoteTimestamp,
  votingClosedTimestamp,
  finishedTimestamp,
  expiredTimestamp,
  isExpired,
  isFinished,
  isExecuted,
  isFailed,
  state,
  canceledTimestamp,
  failedTimestamp,
}: {
  now: number;
  createdTimestamp: number;
  openToVoteTimestamp: number;
  votingClosedTimestamp: number;
  finishedTimestamp: number;
  expiredTimestamp: number;
  isExpired: boolean;
  isFinished: boolean;
  isExecuted: boolean;
  isFailed: boolean;
  state: ProposalStateWithName;
  canceledTimestamp?: number;
  failedTimestamp?: number;
}): TimelineItemType[] {
  return [
    {
      title: texts.proposals.timelinePointCreated,
      position: getPosition(now, createdTimestamp, openToVoteTimestamp),
      finished: true,
      timestamp: createdTimestamp,
      type: TimelineItemTypeType.created,
      visibility: true,
      rocketVisible: state === ProposalStateWithName.Created,
    },
    {
      title: texts.proposals.timelinePointOpenVote,
      position: getPosition(now, openToVoteTimestamp, votingClosedTimestamp),
      finished: now >= openToVoteTimestamp || !!canceledTimestamp || isExpired,
      timestampForEstimatedState: !(
        now >= openToVoteTimestamp ||
        !!canceledTimestamp ||
        isExpired
      )
        ? openToVoteTimestamp - now > 61
          ? openToVoteTimestamp
          : undefined
        : undefined,
      timestamp: openToVoteTimestamp,
      type: TimelineItemTypeType.openToVote,
      visibility: canceledTimestamp
        ? canceledTimestamp >= openToVoteTimestamp
        : true,
      rocketVisible:
        (state === ProposalStateWithName.Voting ||
          state === ProposalStateWithName.Succeed) &&
        now <= votingClosedTimestamp &&
        !isFinished,
    },
    {
      title: texts.proposals.timelinePointVotingClosed,
      position: getPosition(now, votingClosedTimestamp, finishedTimestamp),
      finished:
        now >= votingClosedTimestamp || !!canceledTimestamp || isExpired,
      timestampForEstimatedState:
        now >= openToVoteTimestamp &&
        !(now >= votingClosedTimestamp || !!canceledTimestamp || isExpired)
          ? votingClosedTimestamp - now > 61
            ? votingClosedTimestamp
            : undefined
          : undefined,
      timestamp: votingClosedTimestamp,
      type: TimelineItemTypeType.votingClosed,
      state: getVotingClosedState({
        now,
        votingClosedTimestamp,
        canceledTimestamp,
        isExecuted,
        state,
      }),
      visibility: canceledTimestamp
        ? canceledTimestamp >= votingClosedTimestamp
        : true,
      rocketVisible: now >= votingClosedTimestamp && !isFinished,
    },
    {
      title: texts.proposals.timelinePointFinished,
      finished: isFinished || !!canceledTimestamp,
      timestampForEstimatedState:
        now >= openToVoteTimestamp &&
        now >= votingClosedTimestamp &&
        !(isFinished || !!canceledTimestamp)
          ? finishedTimestamp - now > 61
            ? finishedTimestamp
            : undefined
          : undefined,
      timestamp: isExpired
        ? expiredTimestamp
        : canceledTimestamp
          ? canceledTimestamp
          : failedTimestamp
            ? failedTimestamp
            : finishedTimestamp,
      type: TimelineItemTypeType.finished,
      state: isFinished || !!canceledTimestamp ? state : undefined,
      visibility: true,
      color:
        isFinished && isExecuted
          ? 'bigSuccess'
          : isFinished && isFailed
            ? 'bigError'
            : (isFinished && isExpired) || !!canceledTimestamp
              ? 'bigCanceled'
              : 'bigRegular',
    },
  ];
}
