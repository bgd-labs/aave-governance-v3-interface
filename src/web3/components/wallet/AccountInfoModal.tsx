import { selectAllTransactionsByWallet } from '@bgd-labs/frontend-web3-utils';
import React from 'react';

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
}

export function AccountInfoModal({
  isOpen,
  setIsOpen,
  setAllTransactionModalOpen,
  ensName,
  ensAvatar,
  isAvatarExists,
  representedAddresses,
}: AccountInfoModalProps) {
  const { activeWallet, disconnectActiveWallet, setModalOpen } = useStore();

  const allTransactions = useStore((state) =>
    selectAllTransactionsByWallet<TransactionUnion>(
      state,
      activeWallet?.address || '',
    ),
  );

  const handleDisconnectClick = async () => {
    await disconnectActiveWallet();
    setIsOpen(false);
    setModalOpen(false);
  };

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      withoutAnimationWhenOpen>
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
        onDisconnectButtonClick={handleDisconnectClick}
        onAllTransactionButtonClick={() => {
          setIsOpen(false);
          setAllTransactionModalOpen(true);
        }}
        representedAddresses={representedAddresses}
      />
    </BasicModal>
  );
}
