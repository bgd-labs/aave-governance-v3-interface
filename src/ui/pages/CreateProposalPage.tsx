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
import { Container } from '../primitives/Container';
import { ROUTES } from '../utils/routes';
import { texts } from '../utils/texts';

export function CreateProposalPage() {
  const theme = useTheme();
  const router = useRouter();
  const {
    activeWallet,
    setConnectWalletModalOpen,
    appMode,
    getDetailedProposalsData,
    totalProposalCount,
    getTotalPayloadsCount,
    getTotalProposalCount,
  } = useStore();

  useEffect(() => {
    getTotalProposalCount();
    getTotalPayloadsCount();
  }, []);

  useEffect(() => {
    getDetailedProposalsData(
      [],
      0,
      undefined,
      totalProposalCount >= 0 ? totalProposalCount : 1,
    );
  }, [totalProposalCount]);

  return (
    <Container>
      <Box sx={{ display: 'flex', mb: 12 }}>
        <BackButton3D onClick={router.back} isVisibleOnMobile />
      </Box>

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
  );
}
