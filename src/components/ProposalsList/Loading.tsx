'use client';

import { Box, useTheme } from '@mui/system';
import React from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { VotingPowerLoading } from './VotingPowerLoading';

export function Loading({ isFinished }: { isFinished?: boolean }) {
  const theme = useTheme();
  const activeWallet = useStore((state) => state.activeWallet);

  return !isFinished ? (
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
              '.ProposalListItem__title--loading, .ProposalListItem__title--loading > div':
                {
                  height: 16,
                  [theme.breakpoints.up('lg')]: {
                    height: 18,
                  },
                },
            }}>
            <CustomSkeleton
              className="ProposalListItem__title--loading"
              width="100%"
            />
            <CustomSkeleton
              className="ProposalListItem__title--loading"
              width="100%"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              '.ProposalListItem__status--loading, .ProposalListItem__status--loading > div':
                {
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
              <CustomSkeleton width={102} height={18} />
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
                mb: 4,
              }}>
              <CustomSkeleton width={60} height={18} />
              <CustomSkeleton width={60} height={18} />
            </Box>
            <CustomSkeleton width="100%" height={6} />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 4,
              }}>
              <CustomSkeleton width={60} height={18} />
              <CustomSkeleton width={60} height={18} />
            </Box>
            <CustomSkeleton width="100%" height={6} />
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
            <CustomSkeleton width={102} height={18} />
          </Box>
        </Box>
      )}
    </>
  ) : (
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
              '.ProposalListItem__title--loading, .ProposalListItem__title--loading > div':
                {
                  height: 16,
                  [theme.breakpoints.up('lg')]: {
                    height: 18,
                  },
                },
            }}>
            <CustomSkeleton
              className="ProposalListItem__title--loading"
              width="100%"
            />
            <CustomSkeleton
              className="ProposalListItem__title--loading"
              width="100%"
            />
          </Box>
        </Box>

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
              sx={{
                '.ProposalListItem__title--loading, .ProposalListItem__title--loading > div':
                  {
                    height: 16,
                    width: 60,
                    [theme.breakpoints.up('lg')]: {
                      height: 18,
                    },
                  },
              }}>
              <CustomSkeleton
                className="ProposalListItem__title--loading"
                width="100%"
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              '.ProposalListItem__title--loading, .ProposalListItem__title--loading > div':
                {
                  width: 100,
                  height: 28,
                  [theme.breakpoints.up('lg')]: {
                    width: 110,
                    height: 34,
                  },
                },
            }}>
            <CustomSkeleton
              className="ProposalListItem__title--loading"
              width="100%"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
