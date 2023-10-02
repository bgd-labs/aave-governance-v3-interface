import { ProposalState } from '@bgd-labs/aave-governance-ui-helpers/src';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';

import SuccessIcon from '/public/images/icons/check.svg';
import ErrorIcon from '/public/images/icons/cross.svg';

import { IconBox } from '../../../ui/primitives/IconBox';
import { proposalStatuses } from '../../utils/statuses';

interface ProposalListItemFinalStatusProps {
  timestamp: number;
  status: ProposalState;
}

export function ProposalListItemFinalStatus({
  timestamp,
  status,
}: ProposalListItemFinalStatusProps) {
  const theme = useTheme();
  const statusTitle = proposalStatuses.find((s) => s.value === status)?.title;

  const color =
    status === ProposalState.Defeated
      ? '$mainAgainst'
      : status === ProposalState.Executed
      ? '$mainFor'
      : '$disabled';

  const icon = status === ProposalState.Executed ? SuccessIcon : ErrorIcon;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row-reverse',
        [theme.breakpoints.up('sm')]: {
          justifyContent: 'flex-start',
          flexDirection: 'row',
        },
      }}>
      <Box
        sx={{
          ml: 15,
          [theme.breakpoints.up('sm')]: { mr: 30, ml: 0 },
          [theme.breakpoints.up('lg')]: { mr: 50 },
        }}>
        <Box
          component="p"
          sx={{
            typography: 'body',
            color: theme.palette.$textSecondary,
          }}>
          {dayjs.unix(timestamp).format('MMM D, YYYY')}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          [theme.breakpoints.up('sm')]: {
            width: 100,
            height: 28,
            borderColor: color,
            borderStyle: 'solid',
            borderWidth: '2px',
          },
          [theme.breakpoints.up('lg')]: {
            width: 110,
            height: 34,
          },
        }}>
        <IconBox
          sx={{
            width: status === ProposalState.Executed ? 14 : 12,
            height: status === ProposalState.Executed ? 14 : 12,
            '> svg': {
              width: status === ProposalState.Executed ? 14 : 12,
              height: status === ProposalState.Executed ? 14 : 12,
            },
            position: 'relative',
            mr: 5,
            bottom: '0.5px',
            path: { stroke: theme.palette[color] },
            [theme.breakpoints.up('lg')]: {
              bottom: 0,
            },
          }}>
          {icon()}
        </IconBox>
        <Box component="p" sx={{ typography: 'buttonMedium', lineHeight: 1 }}>
          {statusTitle}
        </Box>
      </Box>
    </Box>
  );
}
