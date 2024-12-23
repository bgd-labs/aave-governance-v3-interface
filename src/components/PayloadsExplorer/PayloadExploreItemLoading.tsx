import { Box, useTheme } from '@mui/system';
import React from 'react';

import { texts } from '../../helpers/texts/texts';
import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { BoxWith3D } from '../BoxWith3D';
import { CustomSkeleton } from '../primitives/CustomSkeleton';

export function PayloadExploreItemLoading({
  isColumns,
  noData,
}: {
  isColumns: boolean;
  noData?: boolean;
}) {
  const theme = useTheme();
  const xsm = useMediaQuery(media.xs);

  const isColumn = isColumns && xsm;

  return (
    <BoxWith3D
      className="ProposalLoading__SSR"
      contentColor="$mainLight"
      wrapperCss={{
        mb: isColumn ? 0 : 18,
        [theme.breakpoints.up('sm')]: { mb: isColumns ? 0 : 24 },
        '> div, .BoxWith3D__content': {
          height: isColumn ? '100%' : 'auto',
        },
      }}
      css={{
        display: 'flex',
        flexDirection: 'column',
        p: isColumn ? '12px 8px' : '18px',
        '*': {
          lineHeight: '1 !important',
        },
        [theme.breakpoints.up('sm')]: {
          flexDirection: isColumn ? 'column' : 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: '18px 24px',
        },
        [theme.breakpoints.up('lg')]: {
          p: isColumn ? '14px 12px' : '22px 30px',
        },
      }}>
      {noData ? (
        <Box
          sx={{ typography: 'h2', p: 8, width: '100%', textAlign: 'center' }}>
          {texts.other.noPayloadsInController}
        </Box>
      ) : (
        <>
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
              <CustomSkeleton width={80} height={isColumn ? 14 : 24} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <CustomSkeleton width={190} height={isColumn ? 14 : 24} />
            </Box>
            <CustomSkeleton width={190} height={isColumn ? 14 : 24} />
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
              <Box
                sx={{
                  typography: 'h2',
                  mb: 4,
                  [theme.breakpoints.up('sm')]: {
                    mb: isColumn ? 4 : 12,
                    mt: isColumn ? 16 : 0,
                  },
                }}>
                <CustomSkeleton width={60} height={isColumn ? 14 : 23} />
              </Box>
              <Box>
                <Box sx={{ mb: 4 }}>
                  <CustomSkeleton width={120} height={isColumn ? 14 : 24} />
                </Box>
                <Box sx={{ mb: 4 }}>
                  <CustomSkeleton width={120} height={isColumn ? 14 : 24} />
                </Box>
                <Box sx={{ mb: 4 }}>
                  <CustomSkeleton width={120} height={isColumn ? 14 : 24} />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              [theme.breakpoints.up('xsm')]: {
                flexDirection: isColumn ? 'column-reverse' : 'row-reverse',
                alignItems: isColumn ? 'flex-start' : 'center',
                justifyContent: isColumn ? 'space-between' : 'space-between',
              },
              [theme.breakpoints.up('sm')]: {
                flexDirection: isColumn ? 'row-reverse' : 'column',
                alignItems: isColumn ? 'center' : 'flex-end',
                justifyContent: isColumn ? 'space-between' : 'flex-end',
                mt: isColumn ? 16 : 0,
                width: isColumn ? '100%' : 'auto',
              },
              [theme.breakpoints.up('md')]: {
                flex: 1,
              },
              [theme.breakpoints.up('lg')]: {
                mt: isColumn ? 18 : 0,
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
                [theme.breakpoints.up('xsm')]: {
                  order: 0,
                  mt: isColumn ? 12 : 0,
                },
                [theme.breakpoints.up('sm')]: {
                  order: 0,
                  mt: 0,
                  mb: isColumn ? 0 : 12,
                },
                [theme.breakpoints.up('lg')]: {
                  minWidth: 102,
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
        </>
      )}
    </BoxWith3D>
  );
}
