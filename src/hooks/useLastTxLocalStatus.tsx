'use client';

import { useLastTxLocalStatus as baseUseTxLocalStatus } from '@bgd-labs/frontend-web3-utils';
import { zeroAddress } from 'viem';

import { useStore } from '../providers/ZustandStoreProvider';
import { TransactionUnion } from '../store/transactionsSlice';

export function useLastTxLocalStatus({
  type,
  payload,
}: Pick<TransactionUnion, 'type' | 'payload'>) {
  const transactionsPool = useStore((store) => store.transactionsPool);
  const activeWallet = useStore((store) => store.activeWallet);
  return baseUseTxLocalStatus<TransactionUnion>({
    transactionsPool,
    activeAddress: activeWallet?.address || zeroAddress,
    type,
    payload,
  });
}
