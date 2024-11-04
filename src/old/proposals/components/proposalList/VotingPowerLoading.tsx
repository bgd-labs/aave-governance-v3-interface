import { Box, useTheme } from '@mui/system';
import React from 'react';

import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';

export function VotingPowerLoading() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        textAlign: 'left',
        minWidth: 145,
        display: 'flex',
        alignItems: 'flex-end',
        [theme.breakpoints.up('md')]: { display: 'block', textAlign: 'center' },
        '*': {
          lineHeight: '1 !important',
        },
        '.VotingPowerLoading__title': {
          height: 13,
          [theme.breakpoints.up('lg')]: {
            height: 16,
          },
        },
        '.VotingPowerLoading__value': {
          height: 17,
          [theme.breakpoints.up('md')]: {
            height: 19,
          },
        },
      }}>
      <Box sx={{ mr: 6, [theme.breakpoints.up('md')]: { mb: 4, mr: 0 } }}>
        <CustomSkeleton className="VotingPowerLoading__title" width={120} />
      </Box>
      <CustomSkeleton className="VotingPowerLoading__value" width={60} />
    </Box>
  );
}
