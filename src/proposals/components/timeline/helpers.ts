import {
  Proposal,
  ProposalStateWithName,
} from '@bgd-labs/aave-governance-ui-helpers';
import { BigNumber } from 'bignumber.js';

import { texts } from '../../../ui/utils/texts';
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
  return new BigNumber(now - start)
    .dividedBy(end - start)
    .multipliedBy(100)
    .toNumber();
}

export function getOpenToVoteTimestamp(now: number, proposal: Proposal) {
  const { startTime: votingStartTime } = proposal.data.votingMachineData;
  const proposalCreationTime = proposal.data.creationTime;

  if (votingStartTime > 0) {
    return votingStartTime;
  } else if (
    now >
    proposalCreationTime + proposal.config.coolDownBeforeVotingStart
  ) {
    return now + 60;
  } else {
    return proposalCreationTime + proposal.config.coolDownBeforeVotingStart;
  }
}

export function getVotingClosedTimestamp(
  now: number,
  proposal: Proposal,
  isFinished: boolean,
  openToVoteTimestamp: number,
) {
  const {
    votingClosedAndSentTimestamp: votingClosedAndSentTime,
    endTime: votingEndTime,
    sentToGovernance,
  } = proposal.data.votingMachineData;

  if (votingClosedAndSentTime > 0) {
    return votingClosedAndSentTime;
  } else if (
    (votingEndTime > 0 && sentToGovernance) ||
    (votingEndTime > 0 && now < votingEndTime) ||
    (votingEndTime > 0 && isFinished)
  ) {
    return votingEndTime;
  } else if (votingEndTime > 0 && now > votingEndTime) {
    return now + 60;
  } else {
    return openToVoteTimestamp + proposal.data.votingDuration;
  }
}

export function getFinishedTimestamp(
  now: number,
  proposal: Proposal,
  lastPayloadExecutedAt: number,
  lastPayloadQueuedAt: number,
  openToVoteTimestamp: number,
) {
  const { votingClosedAndSentTimestamp, endTime: votingEndTime } =
    proposal.data.votingMachineData;
  const payloadsExecutionDelay = proposal.timings.executionDelay;

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
    return lastPayloadQueuedAt + proposal.timings.executionDelay;

    // if proposal queued but not executed
  } else if (proposal.data.queuingTime > 0 && lastPayloadQueuedAt === 0) {
    return proposal.data.queuingTime + proposal.timings.executionDelay;

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
    return (
      openToVoteTimestamp +
      proposal.data.votingDuration +
      payloadsExecutionDelay
    );
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
        (state === ProposalStateWithName.Active ||
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
