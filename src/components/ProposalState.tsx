import { Box } from '@mui/system';

import { proposalStatuses } from '../helpers/statuses';
import { ProposalState as State } from '../types';

export interface ProposalStateProps {
  state: State;
  isSecondary?: boolean;
  isFinished?: boolean;
}

export function ProposalState({
  state,
  isFinished,
  isSecondary,
}: ProposalStateProps) {
  const statusTitle = proposalStatuses.find((s) => s.value === state)?.title;

  return (
    <Box
      className="ProposalStatus"
      component="p"
      sx={{
        typography: 'headline',
        mr: 4,
        color: isFinished
          ? '$text'
          : state === State.Failed
            ? '$mainAgainst'
            : state === State.Succeed
              ? '$mainFor'
              : state === State.Expired
                ? '$textDisabled'
                : isSecondary
                  ? '$textSecondary'
                  : '$text',
      }}>
      {statusTitle}
    </Box>
  );
}
