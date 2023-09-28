import { Box } from '@mui/system';
import { ProposalState } from 'aave-governance-ui-helpers';

import { proposalStatuses } from '../utils/statuses';

export interface ProposalStatusProps {
  status: ProposalState;
  isSecondary?: boolean;
  isFinished?: boolean;
}

export function ProposalStatus({
  status,
  isFinished,
  isSecondary,
}: ProposalStatusProps) {
  const statusTitle = proposalStatuses.find((s) => s.value === status)?.title;

  return (
    <Box
      className="ProposalStatus"
      component="p"
      sx={{
        typography: 'headline',
        mr: 4,
        color: isFinished
          ? '$text'
          : status === ProposalState.Defeated
          ? '$mainAgainst'
          : status === ProposalState.Succeed
          ? '$mainFor'
          : status === ProposalState.Expired
          ? '$textDisabled'
          : isSecondary
          ? '$textSecondary'
          : '$text',
      }}>
      {statusTitle}
    </Box>
  );
}
