'use client';

import { useLastTxLocalStatus as baseUseTxLocalStatus } from '@bgd-labs/frontend-web3-utils';
import { zeroAddress } from 'viem';

import { useStore } from '../../store';
import { TransactionUnion } from '../store/transactionsSlice';

export function useLastTxLocalStatus({
  type,
  payload,
}: Pick<TransactionUnion, 'type' | 'payload'>) {
  const state = useStore();

  return baseUseTxLocalStatus<TransactionUnion>({
    state,
    activeAddress: state.activeWallet?.address || zeroAddress,
    type,
    payload,
  });
}
