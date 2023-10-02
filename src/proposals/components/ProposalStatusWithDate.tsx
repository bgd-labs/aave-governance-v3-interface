import { ProposalWaitForState } from '@bgd-labs/aave-governance-ui-helpers/src';
import { Box, SxProps } from '@mui/system';
import dayjs from 'dayjs';

import { ProposalStatus, ProposalStatusProps } from './ProposalStatus';

export interface ProposalStatusWithDateProps extends ProposalStatusProps {
  timestamp: number;
  waitForState?: ProposalWaitForState;
  isFinished: boolean;
  css?: SxProps;
}

export function ProposalStatusWithDate({
  status,
  timestamp,
  isSecondary,
  waitForState,
  isFinished,
  css,
}: ProposalStatusWithDateProps) {
  return (
    <Box
      className="ProposalStatusWithDate"
      sx={{ display: 'flex', mr: 12, whiteSpace: 'nowrap', ...css }}>
      {waitForState && !isFinished ? (
        <Box
          className="ProposalStatus"
          component="p"
          sx={{
            typography: 'headline',
            color: isSecondary ? '$textSecondary' : '$text',
          }}>
          {waitForState}
        </Box>
      ) : (
        <>
          <ProposalStatus
            status={status}
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
