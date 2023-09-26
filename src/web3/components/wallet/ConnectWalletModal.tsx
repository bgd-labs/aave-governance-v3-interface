import { useEffect, useState } from 'react';

import { getBrowserWalletLabelAndIcon } from '../../../../lib/web3/src';
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
    walletType: 'Metamask',
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
    walletType: 'GnosisSafe',
    icon: `url(${setRelativePath('/images/wallets/gnosisSafe.svg')})`,
    title: 'Gnosis safe',
    isVisible: typeof window !== 'undefined' && window !== window.parent,
  },
  {
    walletType: 'Impersonated',
    icon: `url(${setRelativePath('/images/wallets/impersonated.svg')})`,
    title: 'Impersonated',
    isVisible: false,
  },
];

export function ConnectWalletModal({
  isOpen,
  setIsOpen,
}: ConnectWalletModalProps) {
  const { walletActivating, walletConnectionError, setModalOpen } = useStore();

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
        wallets={wallets}
        impersonatedFormOpen={impersonatedFormOpen}
        setImpersonatedFormOpen={setImpersonatedFormOpen}
        walletConnectionError={walletConnectionError}
      />
    </BasicModal>
  );
}
