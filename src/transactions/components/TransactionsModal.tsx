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
  const setAccountInfoModalOpen = useStore(
    (store) => store.setAccountInfoModalOpen,
  );
  const activeWallet = useStore((store) => store.activeWallet);
  const transactionsPool = useStore((store) => store.transactionsPool);

  const allTransactions = activeWallet
    ? selectAllTransactionsByWallet<TransactionUnion>(
        transactionsPool,
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
