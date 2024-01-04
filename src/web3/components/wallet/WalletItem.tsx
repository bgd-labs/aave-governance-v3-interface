import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store';
import { BoxWith3D } from '../../../ui';

export type Wallet = {
  walletType: WalletType;
  icon: string;
  title: string;
  onClick?: () => void;
  isVisible?: boolean;
  setOpenImpersonatedForm?: (value: boolean) => void;
};

export function WalletItem({
  walletType,
  title,
  icon,
  onClick,
  setOpenImpersonatedForm,
}: Wallet) {
  const connectWallet = useStore((state) => state.connectWallet);

  const iconSize = 28;

  const handleWalletClick = async () => {
    if (walletType === 'Impersonated' && setOpenImpersonatedForm) {
      setOpenImpersonatedForm(true);
    } else {
      await connectWallet(walletType);
    }
  };

  return (
    <Box
      component="button"
      type="button"
      onClick={!!onClick ? onClick : handleWalletClick}
      sx={{ width: '100%' }}>
      <BoxWith3D
        alwaysWithBorders
        withActions
        contentColor="$mainLight"
        borderSize={4}
        wrapperCss={{
          mb: 12,
        }}
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          p: '8px 14px',
        }}>
        <Box component="h3" sx={{ typography: 'h3', color: '$text' }}>
          {title}
        </Box>

        {walletType === 'Injected' ? (
          <Box
            sx={(theme) => ({
              width: iconSize,
              height: iconSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '> svg': {
                width: iconSize,
                height: iconSize,
                path: {
                  stroke: theme.palette.$main,
                },
              },
            })}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        ) : (
          <Box
            sx={{
              width: iconSize,
              height: iconSize,
              background: icon,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </BoxWith3D>
    </Box>
  );
}
