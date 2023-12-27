'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Hex, zeroAddress } from 'viem';

import { CreateProposalModal } from '../../proposals/components/actionModals/CreateProposalModal';
import { BlockWrapper } from '../../proposals/components/BlockWrapper';
import { Details } from '../../proposals/components/proposal/Details';
import { DetailsShareLinks } from '../../proposals/components/proposal/DetailsShareLinks';
import { LeftPanelWrapper } from '../../proposals/components/proposal/LeftPanelWrapper';
import { ProposalPayloads } from '../../proposals/components/proposal/ProposalPayloads';
import { RightPanelWrapper } from '../../proposals/components/proposal/RightPanelWrapper';
import { useStore } from '../../store';
import { useLastTxLocalStatus } from '../../transactions/hooks/useLastTxLocalStatus';
import { TxType } from '../../transactions/store/transactionsSlice';
import { BackButton3D, BigButton, Container, NoSSR } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { TopPanelContainer } from '../../ui/components/TopPanelContainer';
import { ToTopButton } from '../../ui/components/ToTopButton';
import { getChainName } from '../../ui/utils/getChainName';
import { texts } from '../../ui/utils/texts';
import { InitialParams } from '../types';

interface ProposalCreateOverviewPageProps {
  initialParams: InitialParams;
}

export function ProposalCreateOverviewPage({
  initialParams,
}: ProposalCreateOverviewPageProps) {
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
    setIpfsDataErrors,
  } = useStore();

  useEffect(() => {
    getTotalProposalCount();
  }, []);

  const newProposalId = initialParams.proposalId || totalProposalCount + 1;

  useEffect(() => {
    if (initialParams.ipfsHash) {
      getIpfsData([newProposalId], initialParams.ipfsHash);
    }
    if (totalProposalCount || totalProposalCount === 0) {
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
    type: TxType.createProposal,
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
          <TopPanelContainer withoutContainer>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <BackButton3D
                onClick={router.back}
                alwaysVisible
                alwaysWithBorders
                isVisibleOnMobile
              />
              {newIpfsData &&
                !!(payloads || []).length &&
                initialParams.votingPortal !== zeroAddress &&
                !Object.keys(createPayloadsErrors).length && (
                  <BigButton
                    disabled={tx.isSuccess}
                    loading={tx.pending}
                    onClick={handleCreate}>
                    {texts.proposalActions.createProposal}
                  </BigButton>
                )}
            </Box>
          </TopPanelContainer>

          <Box
            sx={{
              position: 'relative',
              mb: 18,
              [theme.breakpoints.up('sm')]: { display: 'none' },
            }}>
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              {!newIpfsData && !newIpfsDataError ? (
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
                !newIpfsDataError && (
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
                )
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
              <NoSSR>
                {(payloads || []).every((payload) => !!payload) &&
                  payloads.some((payload) => !payload?.state) && (
                    <BlockWrapper contentColor="$mainAgainst">
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
                    </BlockWrapper>
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
                  <BlockWrapper contentColor="$mainLight" toBottom>
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
                  </BlockWrapper>
                )}
              </NoSSR>
            </LeftPanelWrapper>

            <RightPanelWrapper onlyChildren={!!newIpfsDataError}>
              <Box
                sx={{
                  display: 'none',
                  [theme.breakpoints.up('sm')]: { display: 'block' },
                }}>
                {!newIpfsData && !newIpfsDataError ? (
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
                  !newIpfsDataError && (
                    <>
                      <Box component="h2" sx={{ typography: 'h1', mb: 16 }}>
                        {newIpfsData.title}
                      </Box>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 44 }}>
                        <DetailsShareLinks
                          ipfs={newIpfsData}
                          ipfsError={newIpfsDataError}
                          forCreate
                        />
                      </Box>
                    </>
                  )
                )}
              </Box>

              <Details
                ipfs={newIpfsData}
                ipfsError={newIpfsDataError}
                onClick={() => {
                  if (initialParams.ipfsHash) {
                    setIpfsDataErrors(initialParams.ipfsHash, '');
                    getIpfsData([newProposalId], initialParams.ipfsHash);
                  }
                }}
              />
            </RightPanelWrapper>
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
