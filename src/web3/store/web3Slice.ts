import {
  createWalletSlice,
  IWalletSlice,
  StaticJsonRpcBatchProvider,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils/src';
import { ethers } from 'ethers';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { chainInfoHelper } from '../../utils/configs';
import { DelegationService } from '../services/delegationService';
import { GovDataService } from '../services/govDataService';

/**
 * web3Slice is required only to have a better control over providers state i.e
 * change provider, trigger data refetch if provider changed and have globally available instances of rpcs and data providers
 */
export type IWeb3Slice = IWalletSlice & {
  govDataService: GovDataService;
  delegationService: DelegationService;

  connectSigner: () => void;
  initDataServices: (
    providers: Record<
      string,
      StaticJsonRpcBatchProvider | ethers.providers.JsonRpcProvider
    >,
  ) => void;
};

export const createWeb3Slice: StoreSlice<IWeb3Slice, TransactionsSlice> = (
  set,
  get,
) => ({
  ...createWalletSlice({
    walletConnected: () => {
      get().connectSigner();
    },
    getChainParameters: chainInfoHelper.getChainParameters,
  })(set, get),
  govDataService: new GovDataService({}),
  delegationService: new DelegationService({}),

  connectSigner() {
    const activeWallet = get().activeWallet;
    if (activeWallet?.signer) {
      get().govDataService.connectSigner(activeWallet.signer);
      get().delegationService.connectSigner(activeWallet.signer);
    }
  },
  initDataServices(providers) {
    set({ delegationService: new DelegationService(providers) });
    set({ govDataService: new GovDataService(providers) });
    if (this.activeWallet?.signer) {
      get().govDataService.connectSigner(this.activeWallet.signer);
      get().delegationService.connectSigner(this.activeWallet.signer);
    }
  },
});
