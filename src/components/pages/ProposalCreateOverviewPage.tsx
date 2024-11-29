'use client';

import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Address, Hex, zeroAddress } from 'viem';

import { texts } from '../../helpers/texts/texts';
import { useLastTxLocalStatus } from '../../helpers/useLastTxLocalStatus';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TxType } from '../../store/transactionsSlice';
import { PayloadWithHashes, ProposalMetadata } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { BigButton } from '../BigButton';
import { BlockWrapper } from '../BlockWrapper';
import { CreateProposalModal } from '../Create/CreateProposalModal';
import { Container } from '../primitives/Container';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import NoSSR from '../primitives/NoSSR';
import { Details } from '../ProposalsDetails/Details';
import { DetailsShareLinks } from '../ProposalsDetails/DetailsShareLinks';
import { LeftPanelWrapper } from '../ProposalsDetails/LeftPanelWrapper';
import { ProposalPayloads } from '../ProposalsDetails/ProposalPayloads';
import { RightPanelWrapper } from '../ProposalsDetails/RightPanelWrapper';
import { TopPanelContainer } from '../TopPanelContainer';
import { ToTopButton } from '../ToTopButton';

export type PayloadParams = {
  chainId: number;
  accessLevel: number;
  payloadsController: Address;
  payloadId: number;
};

export interface InitialParams {
  proposalId?: number;
  ipfsHash?: Hex;
  votingPortal?: Address;
  payloads: PayloadWithHashes[];
  proposalsCount: number;
  cancellationFee: string;
  ipfsData?: ProposalMetadata;
  ipfsError?: string;
}

interface ProposalCreateOverviewPageProps {
  initialParams: InitialParams;
}

export function ProposalCreateOverviewPage({
  initialParams,
}: ProposalCreateOverviewPageProps) {
  const {
    proposalId,
    ipfsHash,
    votingPortal,
    proposalsCount,
    payloads,
    cancellationFee,
    ipfsData,
    ipfsError,
  } = initialParams;

  const router = useRouter();
  const theme = useTheme();

  const createProposal = useStore((store) => store.createProposal);
  const activeWallet = useStore((store) => store.activeWallet);
  const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] =
    useState(false);

  const newProposalId = proposalId || proposalsCount;

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
        await createProposal({
          votingPortalAddress: votingPortal as Address,
          ipfsHash: ipfsHash as Hex,
          cancellationFee,
          proposalsCount,
          payloads: payloads.map((payload) => {
            return {
              accessLevel: payload.data.maximumAccessLevelRequired,
              chain: payload.chain,
              payloadId: Number(payload.id),
              payloadsController: payload.payloadsController,
            };
          }),
        }),
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
              {activeWallet &&
                ipfsData &&
                !!(payloads || []).length &&
                initialParams.votingPortal &&
                initialParams.votingPortal !== zeroAddress && (
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
              {!ipfsData ? (
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
                    <Box sx={{ width: '100%', mb: 24 }}>
                      <CustomSkeleton
                        className="ProposalListItem__title--loading"
                        width="100%"
                      />
                    </Box>
                    <CustomSkeleton
                      className="ProposalListItem__title--loading"
                      width="100%"
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Box component="h2" sx={{ typography: 'h1', mb: 18 }}>
                    {ipfsData.title}
                  </Box>
                  <DetailsShareLinks ipfs={ipfsData} forCreate />
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
              <NoSSR>
                {(payloads || []).every((payload) => !!payload) &&
                  payloads.some((payload) => !payload?.data.state) && (
                    <BlockWrapper contentColor="$mainAgainst">
                      {payloads
                        .filter((payload) => !payload?.data.state)
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
                            {getChainName({ chainId: Number(payload.chain) })}{' '}
                            broken or not created
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
                          <Box sx={{ mb: 4, width: '100%' }}>
                            <CustomSkeleton
                              className="ProposalListItem__title--loading"
                              width="100%"
                            />
                          </Box>
                          <Box sx={{ mb: 4, width: '100%' }}>
                            <CustomSkeleton
                              className="ProposalListItem__title--loading"
                              width="100%"
                            />
                          </Box>
                          <CustomSkeleton
                            className="ProposalListItem__title--loading"
                            width="100%"
                          />
                        </Box>
                      );
                    })}
                  </BlockWrapper>
                )}
              </NoSSR>
            </LeftPanelWrapper>

            <RightPanelWrapper>
              <Box
                sx={{
                  display: 'none',
                  [theme.breakpoints.up('sm')]: { display: 'block' },
                }}>
                {!ipfsData ? (
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
                      <Box sx={{ mb: 4, width: '100%' }}>
                        <CustomSkeleton
                          className="ProposalListItem__title--loading"
                          width="100%"
                        />
                      </Box>
                      <CustomSkeleton
                        className="ProposalListItem__title--loading"
                        width="100%"
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <Box component="h2" sx={{ typography: 'h1', mb: 16 }}>
                      {ipfsData.title}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 44 }}>
                      <DetailsShareLinks ipfs={ipfsData} forCreate />
                    </Box>
                  </>
                )}
              </Box>

              <Details ipfs={ipfsData} ipfsError={ipfsError} />
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
        proposalId={newProposalId}
        fullTxErrorMessage={fullTxErrorMessage}
        setFullTxErrorMessage={setFullTxErrorMessage}
        tx={tx}
      />
    </>
  );
}
