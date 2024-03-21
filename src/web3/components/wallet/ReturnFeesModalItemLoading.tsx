import { Box, useTheme } from '@mui/system';
import React from 'react';

import { BoxWith3D } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';

export function ReturnFeesModalItemLoading() {
  const theme = useTheme();

  return (
    <BoxWith3D
      alwaysWithBorders
      anySize
      borderSize={3}
      contentColor="$mainLight"
      bottomBorderColor="$light"
      wrapperCss={{
        mb: 12,
        position: 'relative',
      }}
      css={{
        display: 'flex',
        p: '4px 10px',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 75,
        },
      }}>
      <Box sx={{ display: 'flex', flex: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ typography: 'headline', mb: 2 }}>
            <CustomSkeleton width={150} height={18} />
          </Box>
          <Box sx={{ display: 'inline-flex' }}>
            <CustomSkeleton width={50} height={14} />
          </Box>
        </Box>
        <Box
          sx={{
            ml: 12,
            display: 'flex',
            justifyContent: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
            '.ProposalStatus': {
              mr: 0,
            },
          }}>
          <CustomSkeleton />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          [theme.breakpoints.up('sm')]: {
            display: 'flex',
          },
          '.ProposalStatus': {
            mr: 0,
            typography: 'descriptorAccent',
          },
        }}>
        <CustomSkeleton width={80} height={14} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flex: 1,
        }}>
        <CustomSkeleton width={100} height={20} />
      </Box>
    </BoxWith3D>
  );
}
