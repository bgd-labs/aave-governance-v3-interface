import { WalletType } from '@bgd-labs/frontend-web3-utils';
import {
  IconVariant,
  Web3IconType,
} from '@bgd-labs/react-web3-icons/dist/utils';
import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { BoxWith3D } from '../../../ui';
import { Web3Icon } from '../../../ui/components/Web3Icon';

export type Wallet = {
  walletType: WalletType;
  walletName: string;
  onClick?: () => void;
  isVisible?: boolean;
  setOpenImpersonatedForm?: (value: boolean) => void;
};

export function WalletItem({
  walletType,
  walletName,
  onClick,
  setOpenImpersonatedForm,
}: Wallet) {
  const connectWallet = useStore((state) => state.connectWallet);

  const iconSize = 28;

  const handleWalletClick = async () => {
    if (walletType === WalletType.Impersonated && setOpenImpersonatedForm) {
      setOpenImpersonatedForm(true);
    } else {
      await connectWallet(walletType);
    }
  };

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick ? onClick : handleWalletClick}
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
          {walletName}
        </Box>

        <Web3Icon
          size={iconSize}
          iconInfo={{
            type: Web3IconType.wallet,
            info: { walletName, variant: IconVariant.Full },
          }}
        />
      </BoxWith3D>
    </Box>
  );
}
