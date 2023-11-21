import {
  ClientsRecord,
  createWalletSlice,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { DelegationService } from '../services/delegationService';
import { GovDataService } from '../services/govDataService';

/**
 * web3Slice is required only to have a better control over providers state i.e
 * change provider, trigger data refetch if provider changed and have globally available instances of rpcs and data providers
 */
export type IWeb3Slice = IWalletSlice & {
  // need for connect wallet button to not show last tx status always after connected wallet
  walletConnectedTimeLock: boolean;

  govDataService: GovDataService;
  delegationService: DelegationService;

  connectSigner: () => void;
  initDataServices: (clients: ClientsRecord) => void;
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
  govDataService: new GovDataService({}),
  delegationService: new DelegationService({}),

  walletConnectedTimeLock: false,
  connectSigner() {
    const activeWallet = get().activeWallet;
    set({ walletConnectedTimeLock: true });
    if (activeWallet?.walletClient) {
      get().govDataService.connectSigner(activeWallet.walletClient);
      get().delegationService.connectSigner(activeWallet.walletClient);
    }
    setTimeout(() => set({ walletConnectedTimeLock: false }), 1000);
  },
  initDataServices(clients) {
    set({ delegationService: new DelegationService(clients) });
    set({ govDataService: new GovDataService(clients) });
    get().connectSigner();
  },
});
