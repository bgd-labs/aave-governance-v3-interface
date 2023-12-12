import { selectAllTransactionsByWallet } from '@bgd-labs/frontend-web3-utils';
import React from 'react';

import { useStore } from '../../store';
import { BasicModal } from '../../ui';
import { TransactionUnion, TxType } from '../store/transactionsSlice';
import { TransactionsModalContent } from './TransactionsModalContent';

interface TransactionsModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function TransactionsModal({
  isOpen,
  setIsOpen,
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
      maxWidth={690}
      withCloseButton>
      <TransactionsModalContent
        allTransactions={allTransactions
          .filter(
            (tx) =>
              !!Object.keys(TxType).find((key) => key === tx.type)?.length,
          )
          .sort((a, b) => b.localTimestamp - a.localTimestamp)}
        onBackButtonClick={() => {
          setIsOpen(false);
          setAccountInfoModalOpen(true);
        }}
      />
    </BasicModal>
  );
}
