import {
  getBrowserWalletLabelAndIcon,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';
import { useEffect, useState } from 'react';

import { useStore } from '../../../store';
import { BasicModal } from '../../../ui';
import { setRelativePath } from '../../../ui/utils/relativePath';
import { ConnectWalletModalContent } from './ConnectWalletModalContent';
import { Wallet } from './WalletItem';

interface ConnectWalletModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const browserWalletLabelAndIcon = getBrowserWalletLabelAndIcon();

export const wallets: Wallet[] = [
  {
    walletType: WalletType.Injected,
    icon: browserWalletLabelAndIcon.icon,
    title: browserWalletLabelAndIcon.label,
    isVisible: true,
  },
  {
    walletType: WalletType.Coinbase,
    icon: `url(${setRelativePath('/images/wallets/coinbase.svg')})`,
    title: 'Coinbase',
    isVisible: true,
  },
  {
    walletType: WalletType.WalletConnect,
    icon: `url(${setRelativePath('/images/wallets/walletConnect.svg')})`,
    title: 'WalletConnect',
    isVisible: true,
  },
  {
    walletType: WalletType.Safe,
    icon: `url(${setRelativePath('/images/wallets/gnosisSafe.svg')})`,
    title: 'Safe wallet',
    isVisible: typeof window !== 'undefined' && window !== window.parent,
  },
  {
    walletType: WalletType.Impersonated,
    icon: `url(${setRelativePath('/images/wallets/impersonated.svg')})`,
    title: 'Impersonated',
    isVisible: false,
  },
];

export function ConnectWalletModal({
  isOpen,
  setIsOpen,
}: ConnectWalletModalProps) {
  const { walletActivating, walletConnectionError, setModalOpen, appMode } =
    useStore();

  const [impersonatedFormOpen, setImpersonatedFormOpen] = useState(false);

  useEffect(() => {
    setImpersonatedFormOpen(false);
  }, [isOpen]);

  useEffect(() => {
    if (!walletActivating && !walletConnectionError) {
      setIsOpen(false);
      setModalOpen(false);
    }
  }, [walletActivating, walletConnectionError]);

  return (
    <BasicModal isOpen={isOpen} setIsOpen={setIsOpen} withCloseButton>
      <ConnectWalletModalContent
        walletActivating={walletActivating}
        wallets={wallets.map((wallet) => {
          if (wallet.walletType === WalletType.Impersonated) {
            return {
              ...wallet,
              isVisible: appMode === 'expert',
            };
          } else {
            return wallet;
          }
        })}
        walletConnectionError={walletConnectionError}
        impersonatedFormOpen={impersonatedFormOpen}
        setImpersonatedFormOpen={setImpersonatedFormOpen}
      />
    </BasicModal>
  );
}
