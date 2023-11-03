import { HashZero } from '@bgd-labs/aave-governance-ui-helpers';
import { TransactionStatus, WalletType } from '@bgd-labs/frontend-web3-utils';
import { zeroAddress } from 'viem';

import { TransactionUnion } from '../../transactions/store/transactionsSlice';

export type TransactionItem = TransactionUnion & {
  status?: number | undefined;
  pending: boolean;
  walletType: WalletType;
};

export const generateStatus = () => {
  if (Math.round(Math.random()) > 0) {
    return TransactionStatus.Success;
  } else {
    return TransactionStatus.Reverted;
  }
};

export const makeTestTransaction = (
  timestamp: number,
  pending: boolean,
  status?: TransactionStatus,
) => {
  return {
    type: 'test',
    chainId: 1,
    from: zeroAddress,
    hash: HashZero,
    nonce: timestamp,
    pending: pending,
    to: zeroAddress,
    timestamp: timestamp,
    localTimestamp: timestamp,
    walletType: 'Injected',
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
