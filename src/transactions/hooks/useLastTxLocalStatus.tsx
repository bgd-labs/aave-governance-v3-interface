'use client';

import { useLastTxLocalStatus as baseUseTxLocalStatus } from '@bgd-labs/frontend-web3-utils';
import { zeroAddress } from 'viem';

import { useRootStore } from '../../store/storeProvider';
import { TransactionUnion } from '../store/transactionsSlice';

export function useLastTxLocalStatus({
  type,
  payload,
}: Pick<TransactionUnion, 'type' | 'payload'>) {
  const transactionsPool = useRootStore((store) => store.transactionsPool);
  const activeWallet = useRootStore((store) => store.activeWallet);

  return baseUseTxLocalStatus<TransactionUnion>({
    transactionsPool,
    activeAddress: activeWallet?.address || zeroAddress,
    type,
    payload,
  });
}
