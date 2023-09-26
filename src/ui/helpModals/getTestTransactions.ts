import { ethers } from 'ethers';

import { TransactionUnion } from '../../transactions/store/transactionsSlice';

export type TransactionItem = TransactionUnion & {
  status?: number | undefined;
  pending: boolean;
};

export const generateStatus = () => {
  if (Math.round(Math.random()) > 0) {
    return 1;
  } else {
    return 2;
  }
};

export const makeTestTransaction = (
  timestamp: number,
  pending: boolean,
  status?: number,
) => {
  return {
    type: 'test',
    chainId: 1,
    from: ethers.constants.AddressZero,
    hash: ethers.constants.HashZero,
    nonce: timestamp,
    pending: pending,
    to: ethers.constants.AddressZero,
    timestamp: timestamp,
    localTimestamp: timestamp,
    status,
  } as TransactionItem;
};

export function getTestTransactionsPool() {
  const transactions = [...Array(5)].map((item, index) => {
    return makeTestTransaction(index, false, generateStatus());
  });

  const transactionsPool: Record<number, TransactionItem> = {};
  transactions.forEach((tx) => {
    transactionsPool[tx.localTimestamp] = tx;
  });

  return transactionsPool;
}
