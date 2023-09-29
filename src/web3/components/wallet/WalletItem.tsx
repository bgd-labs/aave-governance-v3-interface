import { WalletType } from '@bgd-labs/frontend-web3-utils/src';
import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store';
import { BoxWith3D } from '../../../ui';

export type Wallet = {
  walletType: WalletType;
  icon: string;
  title: string;
  setOpenImpersonatedForm?: (value: boolean) => void;
  onClick?: () => void;
  isVisible?: boolean;
};

export function WalletItem({
  walletType,
  title,
  icon,
  setOpenImpersonatedForm,
  onClick,
}: Wallet) {
  const connectWallet = useStore((state) => state.connectWallet);

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
          mb: 10,
        }}
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          p: '10px 15px',
        }}>
        <Box component="h3" sx={{ typography: 'h3', color: '$text' }}>
          {title}
        </Box>

        {walletType === 'Metamask' ? (
          <Box
            sx={(theme) => ({
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '> svg': {
                width: 28,
                height: 28,
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
              width: 28,
              height: 28,
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
