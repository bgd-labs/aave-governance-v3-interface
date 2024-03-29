'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { CreatePayloadForm } from '../../proposals/components/CreatePayloadForm';
import { CreateProposalForm } from '../../proposals/components/CreateProposalForm';
import { useStore } from '../../store';
import { BackButton3D } from '../components/BackButton3D';
import { BigButton } from '../components/BigButton';
import { Link } from '../components/Link';
import { NoDataWrapper } from '../components/NoDataWrapper';
import { TopPanelContainer } from '../components/TopPanelContainer';
import { Container } from '../primitives/Container';
import { ROUTES } from '../utils/routes';
import { texts } from '../utils/texts';

export function CreateProposalPage() {
  const theme = useTheme();
  const router = useRouter();

  const activeWallet = useStore((store) => store.activeWallet);
  const setConnectWalletModalOpen = useStore(
    (store) => store.setConnectWalletModalOpen,
  );
  const appMode = useStore((store) => store.appMode);
  const getDetailedProposalsData = useStore(
    (store) => store.getDetailedProposalsData,
  );
  const totalProposalCount = useStore((store) => store.totalProposalCount);
  const getTotalPayloadsCount = useStore(
    (store) => store.getTotalPayloadsCount,
  );
  const getTotalProposalCount = useStore(
    (store) => store.getTotalProposalCount,
  );

  useEffect(() => {
    getTotalProposalCount();
    getTotalPayloadsCount();
  }, []);

  useEffect(() => {
    getDetailedProposalsData({
      ids: [],
      from: 0,
      pageSize: totalProposalCount >= 0 ? totalProposalCount : 1,
      fullData: true,
    });
  }, [totalProposalCount]);

  return (
    <>
      <TopPanelContainer>
        <BackButton3D onClick={router.back} isVisibleOnMobile />
      </TopPanelContainer>

      <Container>
        {appMode !== 'default' ? (
          <>
            {activeWallet?.isActive ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  [theme.breakpoints.up('md')]: { flexDirection: 'row' },
                }}>
                <CreatePayloadForm />
                <CreateProposalForm />
              </Box>
            ) : (
              <NoDataWrapper>
                <Box component="h2" sx={{ typography: 'h1', mt: 8 }}>
                  {texts.createPage.walletNotConnectedTitle}
                </Box>
                <Box sx={{ typography: 'body', mt: 12, mb: 20, maxWidth: 480 }}>
                  {texts.createPage.walletNotConnectedDescription}
                </Box>
                <BigButton onClick={() => setConnectWalletModalOpen(true)}>
                  {texts.createPage.walletNotConnectedButtonTitle}
                </BigButton>
              </NoDataWrapper>
            )}
          </>
        ) : (
          <NoDataWrapper>
            <Box component="h2" sx={{ typography: 'h1', mt: 8 }}>
              {texts.createPage.appModeTitle}
            </Box>
            <Box sx={{ typography: 'body', mt: 12, mb: 20, maxWidth: 480 }}>
              {texts.createPage.appModeDescriptionFirst}
              <br />
              {texts.createPage.appModeDescriptionSecond}
            </Box>
            <Link href={ROUTES.main}>
              <BigButton>{texts.createPage.appModeButtonTitle}</BigButton>
            </Link>
          </NoDataWrapper>
        )}
      </Container>
    </>
  );
}
