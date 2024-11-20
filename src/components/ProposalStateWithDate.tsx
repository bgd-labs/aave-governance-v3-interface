import { Box, SxProps } from '@mui/system';
import dayjs from 'dayjs';

import { ProposalPendingState } from '../types';
import { ProposalState, ProposalStateProps } from './ProposalState';

export interface ProposalStateWithDateProps extends ProposalStateProps {
  timestamp: number;
  pendingState?: ProposalPendingState;
  isFinished: boolean;
  css?: SxProps;
}

export function ProposalStateWithDate({
  state,
  timestamp,
  isSecondary,
  pendingState,
  isFinished,
  css,
}: ProposalStateWithDateProps) {
  return (
    <Box
      className="ProposalStatusWithDate"
      sx={{ display: 'flex', mr: 12, whiteSpace: 'nowrap', ...css }}>
      {pendingState && !isFinished ? (
        <Box
          className="ProposalStatus"
          component="p"
          sx={{
            typography: 'headline',
            color: isSecondary ? '$textSecondary' : '$text',
          }}>
          {pendingState}
        </Box>
      ) : (
        <>
          <ProposalState
            state={state}
            isSecondary={isSecondary}
            isFinished={isFinished}
          />
          <Box
            component="p"
            sx={{ typography: 'body', color: '$textSecondary' }}>
            {dayjs.unix(timestamp).format('MMM D, YYYY')}
          </Box>
        </>
      )}
    </Box>
  );
}
