'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React from 'react';

import { ProposalMetadata } from '../../../../lib/helpers/src';
import { BackButton3D, BoxWith3D, Container } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { Details } from './Details';
import { DetailsShareLinks } from './DetailsShareLinks';

interface ProposalLoadingProps {
  ipfsData?: ProposalMetadata;
  ipfsDataError?: string;
  withContainer?: boolean;
}

export function ProposalLoading({
  ipfsData,
  ipfsDataError,
  withContainer,
}: ProposalLoadingProps) {
  const theme = useTheme();
  const router = useRouter();

  const Content = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 12 }}>
          <BackButton3D onClick={router.back} />
        </Box>

        <Box
          sx={{
            position: 'relative',
            mb: 18,
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ mb: 18 }}>
              {ipfsData ? (
                <Box component="h2" sx={{ typography: 'h1' }}>
                  {ipfsData.title}
                </Box>
              ) : (
                <CustomSkeleton height={22} />
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 18,
              }}>
              <Box sx={{ mr: 12 }}>
                <CustomSkeleton width={100} height={20} />
              </Box>
              <CustomSkeleton width={100} height={20} />
            </Box>

            {ipfsData ? (
              <DetailsShareLinks ipfs={ipfsData} ipfsError={ipfsDataError} />
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 18,
                  }}>
                  <Box sx={{ mr: 12 }}>
                    <CustomSkeleton width={100} height={20} />
                  </Box>
                  <CustomSkeleton width={100} height={20} />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <Box sx={{ mr: 12 }}>
                    <CustomSkeleton width={70} height={20} />
                  </Box>
                  <CustomSkeleton width={70} height={20} />
                </Box>
              </>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 2,
            [theme.breakpoints.up('sm')]: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            },
          }}>
          <Box
            sx={{
              width: '100%',
              mb: 30,
              [theme.breakpoints.up('sm')]: {
                width: 260,
                mb: 0,
                mr: 15,
                position: 'sticky',
                transition: 'all 0.5s ease',
                top: 50,
              },
              [theme.breakpoints.up('md')]: {
                width: 290,
              },
              [theme.breakpoints.up('lg')]: {
                width: 340,
              },
            }}>
            <BoxWith3D
              className="ProposalLoading__SSR"
              borderSize={10}
              contentColor="$mainLight"
              wrapperCss={{ mb: 12 }}
              css={{
                p: 20,
                [theme.breakpoints.up('sm')]: {
                  p: '20px 18px 18px',
                },
                [theme.breakpoints.up('lg')]: {
                  p: '25px 22px 22px',
                },
              }}>
              <Box
                sx={{
                  width: '100%',
                }}>
                <Box sx={{ width: '100%', mb: 12 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <CustomSkeleton width={50} height={14} />
                    <CustomSkeleton width={50} height={14} />
                  </Box>
                  <CustomSkeleton width="100%" height={10} />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <CustomSkeleton width={50} height={14} />
                    <CustomSkeleton width={50} height={14} />
                  </Box>
                  <CustomSkeleton width="100%" height={10} />
                </Box>

                <Box sx={{ m: '10px auto', width: '80%' }}>
                  <CustomSkeleton width="100%" height={18} />
                </Box>
              </Box>
            </BoxWith3D>
          </Box>

          <BoxWith3D
            className="ProposalLoading__SSR"
            borderSize={10}
            contentColor="$mainLight"
            wrapperCss={{
              flex: 1,
              maxWidth: '100%',
              [theme.breakpoints.up('sm')]: {
                maxWidth: 'calc(100% - 275px)',
              },
              [theme.breakpoints.up('md')]: {
                maxWidth: 'calc(100% - 305px)',
              },
              [theme.breakpoints.up('lg')]: {
                maxWidth: 'calc(100% - 355px)',
              },
            }}
            css={{
              p: '20px',
              [theme.breakpoints.up('md')]: {
                p: '25px 35px',
              },
              [theme.breakpoints.up('lg')]: {
                p: '40px 40px 40px 48px',
              },
            }}>
            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: { display: 'block' },
              }}>
              {ipfsData ? (
                <Box component="h2" sx={{ typography: 'h1', mb: 16 }}>
                  {ipfsData.title}
                </Box>
              ) : (
                <Box sx={{ mb: 16 }}>
                  <CustomSkeleton height={22} />
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 12,
                  '.react-loading-skeleton': { width: 70 },
                  [theme.breakpoints.up('lg')]: {
                    '.react-loading-skeleton': { width: 120 },
                  },
                }}>
                <Box sx={{ mr: 20 }}>
                  <CustomSkeleton height={20} />
                </Box>
                <Box sx={{ mr: 12 }}>
                  <CustomSkeleton height={20} />
                </Box>
                <CustomSkeleton height={20} />
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column-reverse',
                mb: 28,
                [theme.breakpoints.up('sm')]: {
                  flexDirection: 'column',
                  mb: 0,
                },
              }}>
              <Box sx={{ mb: 21 }}>
                <CustomSkeleton height={80} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  mb: 20,
                  '.react-loading-skeleton': { width: 70 },
                  [theme.breakpoints.up('lg')]: {
                    '.react-loading-skeleton': { width: 120 },
                  },
                }}>
                <Box sx={{ mr: 12 }}>
                  <CustomSkeleton height={20} />
                </Box>
                <Box sx={{ mr: 12 }}>
                  <CustomSkeleton height={20} />
                </Box>
                <Box sx={{ mr: 12 }}>
                  <CustomSkeleton height={20} />
                </Box>
                <Box sx={{ mr: 12 }}>
                  <CustomSkeleton height={20} />
                </Box>
              </Box>
            </Box>

            {ipfsData ? (
              <Details ipfs={ipfsData} ipfsError={ipfsDataError} />
            ) : (
              <>
                <Box sx={{ mb: 16 }}>
                  <Box sx={{ mb: 8 }}>
                    <CustomSkeleton width={100} height={16} />
                  </Box>
                  <CustomSkeleton height={16} />
                </Box>

                <CustomSkeleton count={20} height={19} />
              </>
            )}
          </BoxWith3D>
        </Box>
      </Box>
    );
  };

  return withContainer ? (
    <Container>
      <Content />
    </Container>
  ) : (
    <Content />
  );
}
