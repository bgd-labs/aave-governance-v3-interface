'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { Details } from '../../proposals/components/proposal/Details';
import { DetailsShareLinks } from '../../proposals/components/proposal/DetailsShareLinks';
import { ProposalPayloads } from '../../proposals/components/proposal/ProposalPayloads';
import { useStore } from '../../store';
import {
  BackButton3D,
  BoxWith3D,
  Container,
  Divider,
  Link,
  NoSSR,
} from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { ToTopButton } from '../../ui/components/ToTopButton';
import { getChainName } from '../../ui/utils/getChainName';
import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';
import { InitialParams } from '../types';

interface CreateByParamsPageProps {
  initialParams: InitialParams;
}

export function CreateByParamsPage({ initialParams }: CreateByParamsPageProps) {
  const router = useRouter();
  const theme = useTheme();

  const {
    totalProposalCount,
    getIpfsData,
    ipfsData,
    ipfsDataErrors,
    createPayloadsData,
    getCreatePayloadsData,
    createPayloadsErrors,
  } = useStore();

  useEffect(() => {
    if (initialParams.ipfsHash) {
      getIpfsData([totalProposalCount + 1], initialParams.ipfsHash);
    }
    if (totalProposalCount) {
      getCreatePayloadsData(totalProposalCount + 1, initialParams.payloads);
    }
  }, [totalProposalCount, initialParams]);

  const newIpfsData = ipfsData[initialParams.ipfsHash || ''];
  const newIpfsDataError = ipfsDataErrors[initialParams.ipfsHash || ''];
  const payloads = createPayloadsData[totalProposalCount + 1];

  if (!initialParams) return null;

  return (
    <Container>
      <Box>
        <Box sx={{ display: 'flex', [theme.breakpoints.up('sm')]: { mb: 12 } }}>
          <BackButton3D onClick={router.back} />
        </Box>

        <Box component="h2" sx={{ typography: 'h2', mb: 12 }}>
          Preview
        </Box>
        <Box
          sx={{
            position: 'relative',
            mb: 18,
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            {!newIpfsData ? (
              <>
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
              </>
            ) : (
              <>
                <Box component="h2" sx={{ typography: 'h1', mb: 18 }}>
                  {newIpfsData.title}
                </Box>
                <DetailsShareLinks
                  ipfs={newIpfsData}
                  ipfsError={newIpfsDataError}
                  forCreate
                />
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
              [theme.breakpoints.up('sm')]: {
                width: 290,
                mr: 15,
                position: 'sticky',
                transition: 'all 0.5s ease',
                top: 50,
              },
              [theme.breakpoints.up('lg')]: {
                width: 340,
              },
            }}>
            <NoSSR>
              {(payloads || []).some((payload) => !payload?.state) && (
                <BoxWith3D
                  wrapperCss={{ mb: 12 }}
                  borderSize={10}
                  contentColor="$mainAgainst"
                  css={{ p: '15px 20px' }}>
                  {payloads
                    .filter((payload) => !payload?.state)
                    .map((payload) => (
                      <Box
                        key={payload.id}
                        component="p"
                        sx={{
                          mt: 4,
                          typography: 'body',
                          color: '$light',
                          fontSize: 12,
                          lineHeight: '15px',
                          textAlign: 'center',
                        }}>
                        Payload id {payload.id} on{' '}
                        {getChainName(payload.chainId)} broken or not created
                      </Box>
                    ))}
                </BoxWith3D>
              )}
            </NoSSR>

            <NoSSR>
              <Box sx={{ mb: 12 }}>
                {!!payloads &&
                payloads.length &&
                !Object.keys(createPayloadsErrors).length ? (
                  <ProposalPayloads
                    proposalId={totalProposalCount + 1}
                    isProposalExecuted={false}
                    payloads={payloads}
                    proposalQueuingTime={100}
                    forCreate
                  />
                ) : !!Object.keys(createPayloadsErrors).length ? (
                  <>
                    {initialParams.payloads
                      .filter(
                        (value) =>
                          !!createPayloadsErrors[value.payloadsController],
                      )
                      .map((value, index) => {
                        return (
                          <Box key={index}>
                            <BoxWith3D
                              borderSize={10}
                              contentColor="$mainLight"
                              bottomBorderColor="$light"
                              css={{ p: '15px 20px 15px 20px' }}>
                              <Box sx={{ wordBreak: 'break-word' }}>
                                Cannot get payload id {value.payloadId}
                                <br />
                                <br />
                                payloadController:{' '}
                                <Link
                                  css={{ display: 'inline-block' }}
                                  href={`${chainInfoHelper.getChainParameters(
                                    value.chainId || appConfig.govCoreChainId,
                                  ).blockExplorers?.default.url}/address/${
                                    value.payloadsController
                                  }`}
                                  inNewWindow>
                                  {value.payloadsController}
                                </Link>
                              </Box>
                            </BoxWith3D>
                          </Box>
                        );
                      })}
                  </>
                ) : (
                  <>
                    {initialParams.payloads.map((value, index) => {
                      return (
                        <Box key={index}>
                          <BoxWith3D
                            borderSize={10}
                            contentColor="$mainLight"
                            bottomBorderColor="$light"
                            css={{ p: '15px 20px 15px 20px' }}>
                            <CustomSkeleton
                              className="ProposalListItem__title--loading"
                              count={3}
                              width="100%"
                            />
                          </BoxWith3D>
                        </Box>
                      );
                    })}
                  </>
                )}
              </Box>
            </NoSSR>
          </Box>

          <BoxWith3D
            className="ProposalLoading__SSR"
            borderSize={10}
            contentColor="$mainLight"
            wrapperCss={{
              flex: 1,
              maxWidth: '100%',
              [theme.breakpoints.up('sm')]: {
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
              {!newIpfsData ? (
                <>
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
                </>
              ) : (
                <>
                  <Box component="h2" sx={{ typography: 'h1', mb: 16 }}>
                    {newIpfsData.title}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 44 }}>
                    <DetailsShareLinks
                      ipfs={newIpfsData}
                      ipfsError={newIpfsDataError}
                      forCreate
                    />
                  </Box>
                </>
              )}
            </Box>

            <Details ipfs={newIpfsData} ipfsError={newIpfsDataError} />
          </BoxWith3D>
        </Box>

        <Box
          sx={{
            position: 'relative',
            mt: 18,
          }}>
          <Box
            sx={{ position: 'relative', zIndex: 2, wordBreak: 'break-word' }}>
            <Box sx={{ typography: 'body', mb: 18 }}>
              <Box component="h2" sx={{ typography: 'h2', mb: 12 }}>
                Initial data
              </Box>
              <Box sx={{ mb: 8 }}>
                Voting portal: {initialParams.votingPortal}
              </Box>
              <Box sx={{ mb: 12 }}>Ipfs hash: {initialParams.ipfsHash}</Box>
              {initialParams.payloads.map((value, index) => {
                return (
                  <React.Fragment key={index}>
                    <Divider />
                    <Box sx={{ py: 12 }}>
                      <Box sx={{ mb: 4 }}>Payload id: {value.payloadId}</Box>
                      <Box sx={{ mb: 4 }}>
                        Payloads controller: {value.payloadsController}
                      </Box>
                      <Box sx={{ mb: 4 }}>Chain Id: {value.chainId}</Box>

                      <Box sx={{ mb: 4 }}>
                        Access level: {value.accessLevel}
                      </Box>
                    </Box>
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

      <ToTopButton />
    </Container>
  );
}
