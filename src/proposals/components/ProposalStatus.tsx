import { CombineProposalState } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';

import { proposalStatuses } from '../utils/statuses';

export interface ProposalStatusProps {
  status: CombineProposalState;
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
          : status === CombineProposalState.Failed
            ? '$mainAgainst'
            : status === CombineProposalState.Succeed
              ? '$mainFor'
              : status === CombineProposalState.Expired
                ? '$textDisabled'
                : isSecondary
                  ? '$textSecondary'
                  : '$text',
      }}>
      {statusTitle}
    </Box>
  );
}
