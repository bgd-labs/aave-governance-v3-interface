import { selectAllTransactionsByWallet } from '@bgd-labs/frontend-web3-utils';
import React from 'react';

import { RepresentedAddress } from '../../representations/store/representationsSlice';
import { useStore } from '../../store';
import { BasicModal } from '../../ui';
import { TransactionUnion } from '../store/transactionsSlice';
import { TransactionsModalContent } from './TransactionsModalContent';

interface TransactionsModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  representedAddresses?: RepresentedAddress[];
}

export function TransactionsModal({
  isOpen,
  setIsOpen,
  representedAddresses,
}: TransactionsModalProps) {
  const store = useStore();
  const { activeWallet, setAccountInfoModalOpen } = store;

  const allTransactions = activeWallet
    ? selectAllTransactionsByWallet<TransactionUnion>(
        store,
        activeWallet.address,
      )
    : [];

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={680}
      withCloseButton
      withoutAnimationWhenOpen>
      <TransactionsModalContent
        allTransactions={allTransactions.sort(
          (a, b) => b.localTimestamp - a.localTimestamp,
        )}
        onBackButtonClick={() => {
          setIsOpen(false);
          setAccountInfoModalOpen(true);
        }}
        representedAddresses={representedAddresses}
      />
    </BasicModal>
  );
}
