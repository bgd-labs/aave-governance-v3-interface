import { Box, useTheme } from '@mui/system';
import React from 'react';

import { BoxWith3D } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';

export function PayloadExploreItemLoading() {
  const theme = useTheme();

  return (
    <BoxWith3D
      className="ProposalLoading__SSR"
      contentColor="$mainLight"
      wrapperCss={{ mb: 18, [theme.breakpoints.up('sm')]: { mb: 24 } }}
      css={{
        display: 'flex',
        flexDirection: 'column',
        p: '18px',
        '*': {
          lineHeight: '1 !important',
        },
        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: '18px 24px',
        },
        [theme.breakpoints.up('lg')]: {
          p: '22px 30px',
        },
      }}>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              mb: 12,
            }}>
            <Box sx={{ mr: 6 }}>
              <CustomSkeleton width={24} height={24} circle />
            </Box>
            <Box sx={{ typography: 'h2' }}>
              <CustomSkeleton width={60} height={23} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', mb: 4 }}>
          <Box sx={{ typography: 'headline', mr: 12 }}>
            <CustomSkeleton width={80} height={24} />
          </Box>
          <CustomSkeleton width={80} height={24} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <CustomSkeleton width={190} height={24} />
        </Box>
        <CustomSkeleton width={190} height={24} />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          my: 18,
          [theme.breakpoints.up('sm')]: {
            my: 0,
            alignItems: 'center',
          },
        }}>
        <Box
          sx={{
            '.PayloadActions__link': {
              typography: 'body',
              hover: { opacity: 0.7 },
            },
          }}>
          <Box sx={{ typography: 'h2', mb: 12 }}>
            <CustomSkeleton width={60} height={23} />
          </Box>
          <Box>
            <Box sx={{ mb: 4 }}>
              <CustomSkeleton width={120} height={24} />
            </Box>
            <Box sx={{ mb: 4 }}>
              <CustomSkeleton width={120} height={24} />
            </Box>
            <Box sx={{ mb: 4 }}>
              <CustomSkeleton width={120} height={24} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flex: 1,
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            typography: 'headline',
            width: 95,
            order: 1,
            [theme.breakpoints.up('sm')]: {
              order: 0,
              mb: 12,
            },
            [theme.breakpoints.up('lg')]: {
              width: 102,
            },
          }}>
          <Box
            sx={{
              width: '100%',
              '.react-loading-skeleton': { width: '100%' },
            }}>
            <CustomSkeleton height={32} />
          </Box>
        </Box>

        <Box>
          <CustomSkeleton width={102} height={20} />
        </Box>
      </Box>
    </BoxWith3D>
  );
}
