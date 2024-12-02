import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import { proposalStatuses } from '../../../helpers/statuses';
import { useStore } from '../../../providers/ZustandStoreProvider';
import {
  DetailedProposalData,
  InitialProposalState,
  ProposalState,
  ProposalStateWithName,
  VotingConfig,
} from '../../../types';
import { CustomSkeleton } from '../../primitives/CustomSkeleton';
import NoSSR from '../../primitives/NoSSR';
import {
  getFinishedTimestamp,
  getOpenToVoteTimestamp,
  getVotingClosedTimestamp,
} from './helpers';
import { TimelineContent } from './TimelineContent';

interface TimelineProps {
  data: DetailedProposalData;
  config: VotingConfig;
  expirationTime: number;
}

export function Timeline({ data, config, expirationTime }: TimelineProps) {
  const theme = useTheme();
  const isRendered = useStore((store) => store.isRendered);

  const now = dayjs().unix();

  const params = {
    now,
    coolDownBeforeVotingStart: config.coolDownBeforeVotingStart,
    votingDuration: config.votingDuration,
    queuingTime: data.proposalData.queuingTime,
    proposalCreationTime: data.proposalData.creationTime,
    votingStartTime: data.votingData.proposalData.startTime,
    votingClosedAndSentTimestamp:
      data.votingData.proposalData.votingClosedAndSentTimestamp,
    sentToGovernance: data.votingData.proposalData.sentToGovernance,
    votingEndTime: data.votingData.proposalData.endTime,
    isFinished: data.formattedData.isFinished,
    payloadsExecutionDelay: data.formattedData.executionDelay,
    lastPayloadQueuedAt: data.formattedData.lastPayloadQueuedAt,
    lastPayloadExecutedAt: data.formattedData.lastPayloadExecutedAt,
  };

  const openToVoteTimestamp = getOpenToVoteTimestamp(params);
  const votingClosedTimestamp = getVotingClosedTimestamp({
    ...params,
    openToVoteTimestamp,
  });
  const finishedTimestamp = getFinishedTimestamp({
    ...params,
    openToVoteTimestamp,
  });

  const expiredTimestamp =
    data.proposalData.state === InitialProposalState.Executed
      ? data.formattedData.lastPayloadExpiredAt
      : params.proposalCreationTime + expirationTime;

  const failedTimestamp =
    data.formattedData.state.state === ProposalState.Failed
      ? votingClosedTimestamp
      : undefined;

  const canceledTimestamp =
    data.formattedData.lastPayloadCanceledAt > data.proposalData.cancelTimestamp
      ? data.formattedData.lastPayloadCanceledAt
      : data.proposalData.cancelTimestamp;

  const state =
    proposalStatuses.find((s) => s.value === data.formattedData.state.state)
      ?.title || ProposalStateWithName.Created;

  // before render for SSR visibility
  if (!isRendered) {
    return (
      <Box sx={{ mb: 18, [theme.breakpoints.up('lg')]: { mb: 24 } }}>
        <CustomSkeleton height={80} />
      </Box>
    );
  }

  return (
    <NoSSR>
      <TimelineContent
        expiredTimestamp={expiredTimestamp}
        createdTimestamp={params.proposalCreationTime}
        openToVoteTimestamp={openToVoteTimestamp}
        votingStartTime={params.votingStartTime}
        votingClosedTimestamp={votingClosedTimestamp}
        finishedTimestamp={finishedTimestamp}
        failedTimestamp={failedTimestamp}
        canceledTimestamp={canceledTimestamp}
        isFinished={params.isFinished}
        state={state}
      />
    </NoSSR>
  );
}
