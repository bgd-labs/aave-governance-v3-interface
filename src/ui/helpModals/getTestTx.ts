import {
  TxAdapter,
  TxLocalStatusTxParams,
} from '@bgd-labs/frontend-web3-utils';
import dayjs from 'dayjs';
import { zeroAddress, zeroHash } from 'viem';

import { TransactionUnion } from '../../transactions/store/transactionsSlice';
import { appConfig } from '../../utils/appConfig';

export function getTestTx({
  txPending,
  txSuccess,
}: {
  txPending: boolean;
  txSuccess: boolean;
}) {
  return {
    adapter: TxAdapter.Ethereum,
    chainId: appConfig.govCoreChainId,
    type: 'test',
    from: zeroAddress,
    localTimestamp: dayjs().unix(),
    txKey: zeroHash,
    hash: zeroHash,
    walletType: 'Injected',
    pending: txPending,
    isError: false,
    isSuccess: txSuccess,
    isReplaced: false,
  } as TxLocalStatusTxParams<TransactionUnion>;
}
