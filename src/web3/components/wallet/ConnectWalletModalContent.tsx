import { Box } from '@mui/system';
import React from 'react';

import { BoxWith3D } from '../../../ui';
import { RocketLoader } from '../../../ui/components/RocketLoader';
import { texts } from '../../../ui/utils/texts';
import { ImpersonatedForm } from './ImpersonatedForm';
import { Wallet, WalletItem } from './WalletItem';

interface ConnectWalletModalContentProps {
  walletActivating: boolean;
  wallets: Wallet[];
  onWalletButtonClick?: () => void;
  walletConnectionError?: string;
  withoutHelpText?: boolean;
  impersonatedFormOpen?: boolean;
  setImpersonatedFormOpen?: (value: boolean) => void;
}

export function ConnectWalletModalContent({
  walletActivating,
  wallets,
  onWalletButtonClick,
  walletConnectionError,
  withoutHelpText,
  impersonatedFormOpen,
  setImpersonatedFormOpen,
}: ConnectWalletModalContentProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        pt: impersonatedFormOpen ? 60 : 20,
      }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mb: 18,
          width: '100%',
        }}>
        <Box
          component="h2"
          sx={{ typography: 'h2', mb: 30, textAlign: 'center' }}>
          {texts.walletConnect.connectWallet}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: 190,
          }}>
          {walletActivating ? (
            <Box
              sx={{
                display: 'flex',
                backgroundColor: '$paper',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}>
              <RocketLoader />

              <Box component="h3" sx={{ typography: 'h2', mb: 8 }}>
                {texts.walletConnect.connecting}
              </Box>
              <Box component="h3" sx={{ typography: 'h3' }}>
                {texts.walletConnect.walletConfirmation}
              </Box>
            </Box>
          ) : (
            <>
              {impersonatedFormOpen && !!setImpersonatedFormOpen ? (
                <ImpersonatedForm />
              ) : (
                <>
                  {wallets.map((wallet) => (
                    <React.Fragment key={wallet.walletType}>
                      {wallet.isVisible && (
                        <WalletItem
                          walletType={wallet.walletType}
                          walletName={wallet.walletName}
                          setOpenImpersonatedForm={setImpersonatedFormOpen}
                          onClick={onWalletButtonClick}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </>
              )}
            </>
          )}

          {walletConnectionError && (
            <BoxWith3D
              alwaysWithBorders
              contentColor="$error"
              borderSize={4}
              wrapperCss={{
                mb: 12,
                width: '100%',
              }}
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                p: '10px 15px',
              }}>
              <Box
                sx={{
                  color: '$light',
                  fontSize: 12,
                  lineHeight: '15px',
                  textAlign: 'center',
                }}>
                {walletConnectionError}
              </Box>
            </BoxWith3D>
          )}
        </Box>
      </Box>

      {!withoutHelpText && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
          <Box
            component="p"
            sx={{ typography: 'descriptor', color: '$textSecondary' }}>
            {texts.walletConnect.needHelpDescription}
          </Box>
        </Box>
      )}
    </Box>
  );
}
