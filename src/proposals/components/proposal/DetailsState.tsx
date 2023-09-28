import { Box } from '@mui/system';
import { ProposalState } from 'aave-governance-ui-helpers';
import dayjs from 'dayjs';

import { proposalStatuses } from '../../utils/statuses';

interface DetailsStateProps {
  status: ProposalState;
  timestamp: number;
}

export function DetailsState({ status, timestamp }: DetailsStateProps) {
  const statusTitle = proposalStatuses.find((s) => s.value === status)?.title;

  return (
    <Box
      component="p"
      sx={{
        typography: 'body',
        color: '$textSecondary',
        mr: 20,
        display: 'inline-flex',
      }}>
      {statusTitle} {dayjs.unix(timestamp).format('MMM D, YYYY')}
    </Box>
  );
}
