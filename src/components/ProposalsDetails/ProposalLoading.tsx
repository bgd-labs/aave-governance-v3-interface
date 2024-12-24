'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React from 'react';

import { ProposalMetadata } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { BlockWrapper } from '../BlockWrapper';
import { BoxWith3D } from '../BoxWith3D';
import { Container } from '../primitives/Container';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { TopPanelContainer } from '../TopPanelContainer';
import { Details } from './Details';
import { DetailsShareLinks } from './DetailsShareLinks';
import { LeftPanelWrapper } from './LeftPanelWrapper';

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

  const TimelineLoader = () => {
    return (
      <>
        <Box
          sx={{
            display: 'none',
            [theme.breakpoints.up('sm')]: { display: 'block' },
          }}>
          {ipfsData ? (
            <Box
              component="h2"
              sx={{
                typography: 'h1',
                mb: 18,
                [theme.breakpoints.up('lg')]: {
                  typography: 'h1',
                  mb: 24,
                },
              }}>
              {ipfsData.title}
            </Box>
          ) : (
            <Box
              sx={{
                typography: 'h1',
                mb: 18,
                [theme.breakpoints.up('lg')]: {
                  typography: 'h1',
                  mb: 24,
                },
              }}>
              <CustomSkeleton height={22} />
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 18,
              '.react-loading-skeleton': { width: 70 },
              [theme.breakpoints.up('lg')]: {
                '.react-loading-skeleton': { width: 120 },
              },
            }}>
            <Box sx={{ mr: 12 }}>
              <CustomSkeleton height={20} />
            </Box>
            <CustomSkeleton height={20} />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Box sx={{ mb: 24 }}>
            <Box
              sx={{
                display: 'block',
                [theme.breakpoints.up('sm')]: { display: 'none' },
              }}>
              <CustomSkeleton height={153} />
            </Box>
            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: { display: 'block' },
                [theme.breakpoints.up('lg')]: { display: 'none' },
              }}>
              <CustomSkeleton height={153} />
            </Box>
            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('lg')]: { display: 'block' },
              }}>
              <CustomSkeleton height={158} />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              mb: 18,
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
          </Box>
        </Box>
      </>
    );
  };

  const Content = () => {
    return (
      <Box>
        <TopPanelContainer withoutContainer>
          <BackButton3D onClick={router.back} />
        </TopPanelContainer>

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
          <LeftPanelWrapper>
            <BoxWith3D
              className="ProposalLoading__SSR"
              borderSize={10}
              contentColor="$mainLight"
              wrapperCss={{
                mb: 18,
                [theme.breakpoints.up('lg')]: {
                  mb: 24,
                },
              }}
              css={{
                p: 18,
                [theme.breakpoints.up('lg')]: { p: '24px 30px' },
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
                      mb: 4,
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
                      mb: 4,
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
          </LeftPanelWrapper>

          <Box
            sx={{
              flex: 1,
              maxWidth: '100%',
              [theme.breakpoints.up('sm')]: {
                maxWidth: 'calc(100% - 305px)',
              },
              [theme.breakpoints.up('lg')]: {
                maxWidth: 'calc(100% - 365px)',
              },
            }}>
            <Box
              sx={{
                [theme.breakpoints.up('sm')]: { display: 'none' },
              }}>
              <BlockWrapper contentColor="$mainLight" toBottom>
                <TimelineLoader />
              </BlockWrapper>
            </Box>

            <BoxWith3D
              className="ProposalLoading__SSR"
              borderSize={10}
              contentColor="$mainLight"
              wrapperCss={{ width: '100%' }}
              css={{
                p: 18,
                [theme.breakpoints.up('lg')]: { p: '24px 30px' },
              }}>
              <Box
                sx={{
                  display: 'none',
                  [theme.breakpoints.up('sm')]: { display: 'block' },
                }}>
                <TimelineLoader />
              </Box>

              {ipfsData ? (
                <Details ipfs={ipfsData} ipfsError={ipfsDataError} />
              ) : (
                <>
                  <Box
                    sx={(theme) => ({
                      mb: 18,
                      [theme.breakpoints.up('lg')]: {
                        mb: 24,
                      },
                    })}>
                    <Box sx={{ mb: 8 }}>
                      <CustomSkeleton width={100} height={16} />
                    </Box>
                    <CustomSkeleton height={16} />
                  </Box>

                  {[...Array(Number(20)).keys()].map((i) => {
                    return (
                      <Box sx={{ mb: 4 }} key={i}>
                        <CustomSkeleton height={19} />
                      </Box>
                    );
                  })}
                </>
              )}
            </BoxWith3D>
          </Box>
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
