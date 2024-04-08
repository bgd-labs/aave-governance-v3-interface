import {
  getBrowserWalletLabelAndIcon,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';
import { useEffect, useState } from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
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
    isVisible: true,
  },
];

export function ConnectWalletModal({
  isOpen,
  setIsOpen,
}: ConnectWalletModalProps) {
  const walletActivating = useStore((store) => store.walletActivating);
  const walletConnectionError = useStore(
    (store) => store.walletConnectionError,
  );
  const setModalOpen = useStore((store) => store.setModalOpen);

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
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      onBackButtonClick={
        impersonatedFormOpen ? () => setImpersonatedFormOpen(false) : undefined
      }>
      <ConnectWalletModalContent
        walletActivating={walletActivating}
        wallets={wallets}
        walletConnectionError={walletConnectionError}
        impersonatedFormOpen={impersonatedFormOpen}
        setImpersonatedFormOpen={setImpersonatedFormOpen}
      />
    </BasicModal>
  );
}
