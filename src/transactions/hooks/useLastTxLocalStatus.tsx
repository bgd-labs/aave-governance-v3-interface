import { useLastTxLocalStatus as baseUseTxLocalStatus } from '@bgd-labs/frontend-web3-utils';

import { useStore } from '../../store';
import { TransactionUnion } from '../store/transactionsSlice';

export function useLastTxLocalStatus({
  type,
  payload,
}: Pick<TransactionUnion, 'type' | 'payload'>) {
  const state = useStore();

  return baseUseTxLocalStatus<TransactionUnion>({
    state,
    activeAddress: state.activeWallet?.accounts[0] || '',
    type,
    payload,
  });
}
