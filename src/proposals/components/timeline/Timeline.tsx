import {
  CombineProposalState,
  getProposalStepsAndAmounts,
  Proposal,
  ProposalState,
  ProposalStateWithName,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { NoSSR } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { proposalStatuses } from '../../utils/statuses';
import {
  getFinishedTimestamp,
  getOpenToVoteTimestamp,
  getVotingClosedTimestamp,
} from './helpers';
import { TimelineContent } from './TimelineContent';

interface TimelineProps {
  proposal: Proposal;
  loading: boolean;
}

export function Timeline({ proposal, loading }: TimelineProps) {
  const theme = useTheme();
  const isRendered = useStore((store) => store.isRendered);

  const now = dayjs().unix();

  const {
    lastPayloadCanceledAt,
    lastPayloadExpiredAt,
    lastPayloadExecutedAt,
    lastPayloadQueuedAt,
    allPayloadsCanceled,
  } = getProposalStepsAndAmounts({
    proposalData: proposal.data,
    quorum: proposal.config.quorum,
    differential: proposal.config.differential,
    precisionDivider: proposal.precisionDivider,
    cooldownPeriod: proposal.timings.cooldownPeriod,
    executionDelay: proposal.timings.executionDelay,
  });

  const isFinished =
    !loading && proposal.combineState >= CombineProposalState.Failed;

  const openToVoteTimestamp = getOpenToVoteTimestamp(now, proposal);

  const votingClosedTimestamp = getVotingClosedTimestamp(
    now,
    proposal,
    isFinished,
    openToVoteTimestamp,
  );

  const finishedTimestamp = getFinishedTimestamp(
    now,
    proposal,
    lastPayloadExecutedAt,
    lastPayloadQueuedAt,
    openToVoteTimestamp,
  );

  const expiredTimestamp =
    proposal.data.state === ProposalState.Executed
      ? lastPayloadExpiredAt
      : proposal.data.creationTime + proposal.timings.expirationTime;

  const votingStartTime = proposal.data.votingMachineData.startTime;

  const createdTimestamp = proposal.data.creationTime;

  const failedTimestamp =
    proposal.combineState === CombineProposalState.Failed
      ? votingClosedTimestamp
      : undefined;

  let canceledTimestamp;
  if (allPayloadsCanceled) {
    canceledTimestamp = lastPayloadCanceledAt;
  } else if (proposal.data.canceledAt > 0) {
    canceledTimestamp = proposal.data.canceledAt;
  }

  const state =
    proposalStatuses.find((s) => s.value === proposal?.combineState)?.title ||
    ProposalStateWithName.Created;

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
        createdTimestamp={createdTimestamp}
        openToVoteTimestamp={openToVoteTimestamp}
        votingStartTime={votingStartTime}
        votingClosedTimestamp={votingClosedTimestamp}
        finishedTimestamp={finishedTimestamp}
        failedTimestamp={failedTimestamp}
        canceledTimestamp={canceledTimestamp}
        isFinished={isFinished}
        state={state}
      />
    </NoSSR>
  );
}
