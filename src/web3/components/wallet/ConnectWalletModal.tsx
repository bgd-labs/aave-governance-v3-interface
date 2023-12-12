import { getBrowserWalletLabelAndIcon } from '@bgd-labs/frontend-web3-utils';
import { useEffect } from 'react';

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
    walletType: 'Injected',
    icon: browserWalletLabelAndIcon.icon,
    title: browserWalletLabelAndIcon.label,
    isVisible: true,
  },
  {
    walletType: 'Coinbase',
    icon: `url(${setRelativePath('/images/wallets/coinbase.svg')})`,
    title: 'Coinbase',
    isVisible: true,
  },
  {
    walletType: 'WalletConnect',
    icon: `url(${setRelativePath('/images/wallets/walletConnect.svg')})`,
    title: 'WalletConnect',
    isVisible: true,
  },
  {
    walletType: 'Safe',
    icon: `url(${setRelativePath('/images/wallets/gnosisSafe.svg')})`,
    title: 'Safe wallet',
    isVisible: typeof window !== 'undefined' && window !== window.parent,
  },
];

export function ConnectWalletModal({
  isOpen,
  setIsOpen,
}: ConnectWalletModalProps) {
  const { walletActivating, walletConnectionError, setModalOpen } = useStore();

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
        wallets={wallets}
        walletConnectionError={walletConnectionError}
      />
    </BasicModal>
  );
}
