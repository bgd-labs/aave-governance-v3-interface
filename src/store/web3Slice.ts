import {
  createWalletSlice,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex } from 'viem';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { fetchCurrentUserPowers } from '../requests/fetchCurrentUserPowers';
import { api } from '../trpc/client';
import { CurrentPower } from '../types';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { TransactionsSlice } from './transactionsSlice';

export type IWeb3Slice = IWalletSlice & {
  // need for connect wallet button to not show last tx status always after connected wallet
  walletConnectedTimeLock: boolean;
  connectSigner: () => void;

  connectWalletModalOpen: boolean;
  setConnectWalletModalOpen: (value: boolean) => void;

  currentPowers: Record<Hex, CurrentPower>;
  getCurrentPowers: (address: Hex, request?: boolean) => Promise<void>;
};

export const createWeb3Slice: StoreSlice<
  IWeb3Slice,
  TransactionsSlice & IRpcSwitcherSlice
> = (set, get) => ({
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

  connectWalletModalOpen: false,
  setConnectWalletModalOpen(value) {
    set({ connectWalletModalOpen: value });
  },

  currentPowers: {},
  getCurrentPowers: async (address, request) => {
    const now = dayjs().unix();
    const activeAddress = get().activeWallet?.address;

    const requestAndSetData = async (adr: Hex) => {
      if (activeAddress) {
        const data = await (isForIPFS
          ? fetchCurrentUserPowers({
              input: {
                walletAddress: activeAddress,
                govCoreClient:
                  selectAppClients(get())[appConfig.govCoreChainId],
              },
            })
          : api.wallet.getCurrentPowers.query({
              walletAddress: activeAddress,
            }));

        set((state) =>
          produce(state, (draft) => {
            draft.currentPowers[adr] = data;
          }),
        );
      }
    };

    if (!!activeAddress && !!get().currentPowers[activeAddress]) {
      if (get().currentPowers[address]) {
        if (get().currentPowers[address].timestamp + 3600000 < now || request) {
          await requestAndSetData(address);
        }
      } else {
        await requestAndSetData(address);
      }
    } else if (activeAddress) {
      await Promise.allSettled([
        await requestAndSetData(activeAddress),
        await requestAndSetData(address),
      ]);
    }
  },
});
