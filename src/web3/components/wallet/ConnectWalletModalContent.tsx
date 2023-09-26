import { Box, useTheme } from '@mui/system';
import React from 'react';

import { BoxWith3D, Link } from '../../../ui';
import { RocketLoader } from '../../../ui/components/RocketLoader';
import { texts } from '../../../ui/utils/texts';
import { ImpersonatedForm } from './ImpersonatedForm';
import { Wallet, WalletItem } from './WalletItem';

interface ConnectWalletModalContentProps {
  walletActivating: boolean;
  wallets: Wallet[];
  impersonatedFormOpen?: boolean;
  setImpersonatedFormOpen?: (value: boolean) => void;
  onWalletButtonClick?: () => void;
  walletConnectionError?: string;
  withoutHelpText?: boolean;
}

export function ConnectWalletModalContent({
  walletActivating,
  wallets,
  impersonatedFormOpen,
  setImpersonatedFormOpen,
  onWalletButtonClick,
  walletConnectionError,
  withoutHelpText,
}: ConnectWalletModalContentProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
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
          sx={{ typography: 'h1', mb: 20, textAlign: 'center' }}>
          {texts.walletConnect.connectWallet}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: 245,
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

              <Box
                component="h3"
                sx={{ typography: 'h3', mb: 7, fontWeight: '600' }}>
                {texts.walletConnect.connecting}
              </Box>
              <Box component="h3" sx={{ typography: 'h3' }}>
                {texts.walletConnect.walletConfirmation}
              </Box>
            </Box>
          ) : (
            <>
              {impersonatedFormOpen && !!setImpersonatedFormOpen ? (
                <ImpersonatedForm closeClick={setImpersonatedFormOpen} />
              ) : (
                <>
                  {wallets.map((wallet) => (
                    <React.Fragment key={wallet.walletType}>
                      {wallet.isVisible && (
                        <WalletItem
                          walletType={wallet.walletType}
                          icon={wallet.icon}
                          title={wallet.title}
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
                mb: 10,
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
          <Box sx={{ typography: 'body', mb: 28 }}>
            {texts.walletConnect.needHelpTitle}{' '}
            <Link
              href="https://docs.aave.com/faq/troubleshooting" // TODO: maybe need change link
              css={{
                color: '$main',
                textDecoration: 'underline',
                hover: { color: theme.palette.$textSecondary },
              }}
              inNewWindow>
              {texts.walletConnect.needHelpFAQ}
            </Link>
          </Box>
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
