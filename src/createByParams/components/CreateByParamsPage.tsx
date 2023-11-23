'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Hex } from 'viem';

import { CreateProposalModal } from '../../proposals/components/actionModals/CreateProposalModal';
import { Details } from '../../proposals/components/proposal/Details';
import { DetailsShareLinks } from '../../proposals/components/proposal/DetailsShareLinks';
import { ProposalPayloads } from '../../proposals/components/proposal/ProposalPayloads';
import { useStore } from '../../store';
import { useLastTxLocalStatus } from '../../transactions/hooks/useLastTxLocalStatus';
import { TxType } from '../../transactions/store/transactionsSlice';
import {
  BackButton3D,
  BigButton,
  BoxWith3D,
  Container,
  Link,
  NoSSR,
} from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { ToTopButton } from '../../ui/components/ToTopButton';
import { getChainName } from '../../ui/utils/getChainName';
import { texts } from '../../ui/utils/texts';
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
    getTotalProposalCount,
    totalProposalCount,
    getIpfsData,
    ipfsData,
    ipfsDataErrors,
    createPayloadsData,
    getCreatePayloadsData,
    createPayloadsErrors,
    isCreateProposalModalOpen,
    setIsCreateProposalModalOpen,
    createProposal,
  } = useStore();

  useEffect(() => {
    getTotalProposalCount();
  }, []);

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

  const {
    error,
    setError,
    isTxStart,
    setIsTxStart,
    executeTxWithLocalStatuses,
    fullTxErrorMessage,
    setFullTxErrorMessage,
    tx,
  } = useLastTxLocalStatus({
    type: TxType.createProposal,
    payload: { proposalId: totalProposalCount },
  });

  if (!initialParams) return null;

  const handleCreate = async () => {
    setIsCreateProposalModalOpen(true);

    await executeTxWithLocalStatuses({
      callbackFunction: async () =>
        await createProposal(
          initialParams.votingPortal as Hex,
          payloads,
          initialParams.ipfsHash as Hex,
        ),
    });
  };

  return (
    <>
      <Container>
        <Box>
          <Box
            sx={{ display: 'flex', [theme.breakpoints.up('sm')]: { mb: 12 } }}>
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
                              wrapperCss={{ mb: 12 }}
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
                            wrapperCss={{ mb: 12 }}
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
            {newIpfsData &&
              !!(payloads || []).length &&
              !Object.keys(createPayloadsErrors).length && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 24,
                  }}>
                  <BigButton
                    disabled={tx.isSuccess}
                    loading={tx.pending}
                    onClick={handleCreate}>
                    {texts.proposalActions.createProposal}
                  </BigButton>
                </Box>
              )}
          </Box>
        </Box>

        <ToTopButton />
      </Container>

      <CreateProposalModal
        error={error}
        setError={setError}
        isOpen={isCreateProposalModalOpen}
        setIsOpen={setIsCreateProposalModalOpen}
        isTxStart={isTxStart}
        setIsTxStart={setIsTxStart}
        proposalId={totalProposalCount}
        fullTxErrorMessage={fullTxErrorMessage}
        setFullTxErrorMessage={setFullTxErrorMessage}
        tx={tx}
      />
    </>
  );
}
