import {
  createWalletSlice,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';

import { TransactionsSlice } from './transactionsSlice';

export type IWeb3Slice = IWalletSlice & {
  // need for connect wallet button to not show last tx status always after connected wallet
  walletConnectedTimeLock: boolean;
  connectSigner: () => void;
};

export const createWeb3Slice: StoreSlice<IWeb3Slice, TransactionsSlice> = (
  set,
  get,
) => ({
  ...createWalletSlice({
    walletConnected: () => {
      get().connectSigner();
    },
  })(set, get),

  walletConnectedTimeLock: false,
  connectSigner() {
    set({ walletConnectedTimeLock: true });
    setTimeout(() => set({ walletConnectedTimeLock: false }), 1000);
  },
});
