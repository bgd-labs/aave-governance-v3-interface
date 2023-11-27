import { Box, useTheme } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { VotingPowerLoading } from './VotingPowerLoading';

export function Loading() {
  const theme = useTheme();
  const activeWallet = useStore((state) => state.activeWallet);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        }}>
        <Box
          sx={{
            width: '100%',
            mb: 20,
            [theme.breakpoints.up('sm')]: { width: 315, mb: 0 },
            [theme.breakpoints.up('lg')]: { width: 440 },
          }}>
          <Box
            sx={{
              mb: 8,
              [theme.breakpoints.up('sm')]: { mb: 12 },
              [theme.breakpoints.up('lg')]: { mb: 16 },
              '.ProposalListItem__title--loading': {
                height: 17,
                [theme.breakpoints.up('lg')]: {
                  height: 21,
                },
              },
            }}>
            <CustomSkeleton
              className="ProposalListItem__title--loading"
              count={2}
              width="100%"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '.ProposalListItem__status--loading': {
                height: 13,
                [theme.breakpoints.up('lg')]: { height: 16 },
              },
            }}>
            <Box sx={{ mr: 12 }}>
              <CustomSkeleton
                className="ProposalListItem__status--loading"
                width={120}
              />
            </Box>
            <CustomSkeleton
              className="ProposalListItem__status--loading"
              width={150}
            />
          </Box>
        </Box>

        {activeWallet?.isActive && (
          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}>
            <VotingPowerLoading />
            <Box sx={{ mt: 8 }}>
              <CustomSkeleton width={102} height={22} />
            </Box>
          </Box>
        )}

        <Box
          sx={{
            width: '100%',
            '*': {
              lineHeight: '1 !important',
            },
            [theme.breakpoints.up('sm')]: { width: 250, ml: 18 },
            [theme.breakpoints.up('lg')]: { width: 300 },
          }}>
          <Box sx={{ width: '100%', mb: 12 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <CustomSkeleton width={60} height={21} />
              <CustomSkeleton width={60} height={21} />
            </Box>
            <CustomSkeleton width="100%" height={8} />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <CustomSkeleton width={60} height={21} />
              <CustomSkeleton width={60} height={21} />
            </Box>
            <CustomSkeleton width="100%" height={8} />
          </Box>
        </Box>
      </Box>

      {activeWallet?.isActive && (
        <Box
          sx={{
            width: '100%',
            display: 'block',
            mt: 12,
            [theme.breakpoints.up('md')]: { display: 'none' },
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <VotingPowerLoading />
            <CustomSkeleton width={102} height={22} />
          </Box>
        </Box>
      )}
    </>
  );
}
