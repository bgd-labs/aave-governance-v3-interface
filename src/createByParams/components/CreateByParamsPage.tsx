'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Hex, zeroAddress } from 'viem';

import { CreateProposalModal } from '../../proposals/components/actionModals/CreateProposalModal';
import { Details } from '../../proposals/components/proposal/Details';
import { DetailsShareLinks } from '../../proposals/components/proposal/DetailsShareLinks';
import { ProposalPayloads } from '../../proposals/components/proposal/ProposalPayloads';
import { useStore } from '../../store';
import { useLastTxLocalStatus } from '../../transactions/hooks/useLastTxLocalStatus';
import { BackButton3D, BigButton, BoxWith3D, Container, NoSSR } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { ToTopButton } from '../../ui/components/ToTopButton';
import { getChainName } from '../../ui/utils/getChainName';
import { texts } from '../../ui/utils/texts';
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

  const newProposalId = initialParams.proposalId || totalProposalCount + 1;

  useEffect(() => {
    if (initialParams.ipfsHash) {
      getIpfsData([newProposalId], initialParams.ipfsHash);
    }
    if (totalProposalCount) {
      getCreatePayloadsData(newProposalId, initialParams.payloads);
    }
  }, [totalProposalCount, initialParams]);

  const newIpfsData = ipfsData[initialParams.ipfsHash || ''];
  const newIpfsDataError = ipfsDataErrors[initialParams.ipfsHash || ''];
  const payloads = initialParams.payloads.map((payload) => {
    return createPayloadsData[
      `${payload.payloadsController}_${payload.payloadId}`
    ];
  });

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
    type: 'createProposal',
    payload: { proposalId: newProposalId },
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
                },
                [theme.breakpoints.up('lg')]: {
                  width: 340,
                },
              }}>
              <NoSSR>
                {(payloads || []).every((payload) => !!payload) &&
                  payloads.some((payload) => !payload?.state) && (
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
                            {getChainName(payload.chainId)} broken or not
                            created
                          </Box>
                        ))}
                    </BoxWith3D>
                  )}
              </NoSSR>

              <NoSSR>
                {!!payloads?.length &&
                payloads.every((payload) => !!payload) ? (
                  <ProposalPayloads
                    proposalId={newProposalId}
                    isProposalExecuted={false}
                    payloads={payloads}
                    proposalQueuingTime={100}
                    forCreate
                  />
                ) : (
                  <BoxWith3D
                    borderSize={10}
                    contentColor="$mainLight"
                    bottomBorderColor="$light"
                    wrapperCss={{ mb: 12 }}
                    css={{
                      p: '15px 20px 15px 20px',
                    }}>
                    {initialParams.payloads.map((value, index) => {
                      return (
                        <Box key={index} sx={{ mb: 12 }}>
                          <CustomSkeleton
                            className="ProposalListItem__title--loading"
                            count={3}
                            width="100%"
                          />
                        </Box>
                      );
                    })}
                  </BoxWith3D>
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
              initialParams.votingPortal !== zeroAddress &&
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
