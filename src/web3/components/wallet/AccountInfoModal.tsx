import { selectAllTransactionsByWallet } from '@bgd-labs/frontend-web3-utils';
import React, { useEffect } from 'react';

import { RepresentedAddress } from '../../../representations/store/representationsSlice';
import { useStore } from '../../../store';
import { TransactionUnion } from '../../../transactions/store/transactionsSlice';
import { BasicModal } from '../../../ui';
import { appConfig } from '../../../utils/appConfig';
import { AccountInfoModalContent } from './AccountInfoModalContent';

interface AccountInfoModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setAllTransactionModalOpen: (value: boolean) => void;
  ensName?: string;
  ensAvatar?: string;
  isAvatarExists?: boolean;
  representedAddresses?: RepresentedAddress[];
  onDisconnectButtonClick: () => void;
}

export function AccountInfoModal({
  isOpen,
  setIsOpen,
  setAllTransactionModalOpen,
  ensName,
  ensAvatar,
  isAvatarExists,
  representedAddresses,
  onDisconnectButtonClick,
}: AccountInfoModalProps) {
  const store = useStore();
  const {
    activeWallet,
    representative,
    getCurrentPowers,
    setIsCreationFeeModalOpen,
  } = store;

  const allTransactions = activeWallet
    ? selectAllTransactionsByWallet<TransactionUnion>(
        store,
        activeWallet.address,
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      if (!!representative.address) {
        getCurrentPowers(representative.address);
      } else if (activeWallet?.address) {
        getCurrentPowers(activeWallet?.address);
      }
    }
  }, [activeWallet?.address, representative.address, isOpen]);

  return (
    <BasicModal
      contentCss={{ marginTop: 12 }}
      isOpen={isOpen}
      setIsOpen={(value) => setTimeout(() => setIsOpen(value), 1)}
      withCloseButton
      maxWidth={690}>
      <AccountInfoModalContent
        ensName={ensName}
        ensAvatar={ensAvatar}
        isAvatarExists={isAvatarExists}
        activeAddress={activeWallet?.address || ''}
        chainId={activeWallet?.chain?.id || appConfig.govCoreChainId}
        isActive={activeWallet?.isActive || false}
        allTransactions={allTransactions.sort(
          (a, b) => b.localTimestamp - a.localTimestamp,
        )}
        onDelegateButtonClick={() => setIsOpen(false)}
        onRepresentationsButtonClick={() => setIsOpen(false)}
        onReturnFeeButtonClick={() => {
          setIsOpen(false);
          setIsCreationFeeModalOpen(true);
        }}
        onDisconnectButtonClick={onDisconnectButtonClick}
        onAllTransactionButtonClick={() => {
          setIsOpen(false);
          setAllTransactionModalOpen(true);
        }}
        representedAddresses={representedAddresses}
      />
    </BasicModal>
  );
}
