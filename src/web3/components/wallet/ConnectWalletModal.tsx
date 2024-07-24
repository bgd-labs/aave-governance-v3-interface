import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { getWeb3WalletName } from '@bgd-labs/react-web3-icons/dist/utils';
import { useEffect, useState } from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { BasicModal } from '../../../ui';
import { ConnectWalletModalContent } from './ConnectWalletModalContent';
import { Wallet } from './WalletItem';

interface ConnectWalletModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export const wallets: Wallet[] = [
  {
    walletType: WalletType.Injected,
    walletName: getWeb3WalletName(),
    isVisible: true,
  },
  {
    walletType: WalletType.Coinbase,
    walletName: 'Coinbase Wallet',
    isVisible: true,
  },
  {
    walletType: WalletType.WalletConnect,
    walletName: 'WalletConnect',
    isVisible: true,
  },
  {
    walletType: WalletType.Safe,
    walletName: 'Safe Wallet',
    isVisible: typeof window !== 'undefined' && window !== window.parent,
  },
  {
    walletType: WalletType.Impersonated,
    walletName: 'Impersonated Wallet',
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
