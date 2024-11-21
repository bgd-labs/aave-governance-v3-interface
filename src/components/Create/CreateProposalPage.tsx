'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React from 'react';

import { ROUTES } from '../../configs/routes';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { CreateProposalPageParams } from '../../types';
import { BackButton3D } from '../BackButton3D';
import { BigButton } from '../BigButton';
import { Link } from '../Link';
import { NoDataWrapper } from '../NoDataWrapper';
import { Container } from '../primitives/Container';
import { TopPanelContainer } from '../TopPanelContainer';
import { CreatePayloadForm } from './CreatePayloadForm';
import { CreateProposalForm } from './CreateProposalForm';

export function CreateProposalPage({ ...params }: CreateProposalPageParams) {
  const theme = useTheme();
  const router = useRouter();

  const activeWallet = useStore((store) => store.activeWallet);
  const setConnectWalletModalOpen = useStore(
    (store) => store.setConnectWalletModalOpen,
  );
  const appMode = useStore((store) => store.appMode);

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
                <CreatePayloadForm {...params} />
                <CreateProposalForm {...params} />
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
