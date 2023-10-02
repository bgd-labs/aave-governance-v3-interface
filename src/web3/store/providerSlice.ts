import { StoreSlice } from '@bgd-labs/frontend-web3-utils/src';
import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils/src/utils/StaticJsonRpcBatchProvider';
import { AddEthereumChainParameter } from '@web3-react/types';
import { produce } from 'immer';

import {
  getLocalStorageRpcUrls,
  setLocalStorageRpcUrls,
} from '../../utils/localStorage';

export type AppProvider = {
  urls: string[];
  instance: StaticJsonRpcBatchProvider;
  chosen: string;
};

export type AppProviderStorage = Omit<AppProvider, 'instance'>;

export type ChainInfo = {
  urls: {
    [chainId: number]: string[];
  };
  providerInstances: {
    [chainId: number]: {
      instance: StaticJsonRpcBatchProvider;
    };
  };
  getChainParameters: (chainId: number) => AddEthereumChainParameter;
};

export interface IProviderSlice {
  appProviders: Record<number, AppProvider>;
  initProviders: (providers: ChainInfo) => void;
  addNewRpc: (chainId: number, url: string) => void;
  // removeRpc: (chainId: number, url: string) => void;
  // setProviders: (providers: Record<number, string>) => void;
  setChosenProvider: (chainId: number, url: string) => void;
  syncLocalStorage: () => void;
}

export const createProviderSlice: StoreSlice<IProviderSlice> = (set, get) => ({
  appProviders: {},
  initProviders: (providers) => {
    set((state) =>
      produce(state, (draft) => {
        Object.keys(providers.urls).forEach((chainId) => {
          const chainIdNumber = Number(chainId);

          draft.appProviders[chainIdNumber] = {
            urls: providers.getChainParameters(chainIdNumber).rpcUrls,
            instance: providers.providerInstances[chainIdNumber].instance,
            chosen: providers.getChainParameters(chainIdNumber).rpcUrls[0],
          };
        });
      }),
    );

    const rpcUrlsFromStorage = getLocalStorageRpcUrls();
    if (rpcUrlsFromStorage !== null && rpcUrlsFromStorage !== undefined) {
      const parsedRpcUrlsFromStorage = JSON.parse(rpcUrlsFromStorage) as Record<
        number,
        AppProviderStorage
      >;

      set((state) =>
        produce(state, (draft) => {
          Object.keys(parsedRpcUrlsFromStorage).forEach((chainId) => {
            const chainIdNumber = Number(chainId);
            if (
              draft.appProviders[chainIdNumber] &&
              (draft.appProviders[chainIdNumber].chosen !==
                parsedRpcUrlsFromStorage[chainIdNumber].chosen ||
                draft.appProviders[chainIdNumber].urls.length !==
                  parsedRpcUrlsFromStorage[chainIdNumber].urls.length)
            ) {
              draft.appProviders[chainIdNumber].chosen =
                parsedRpcUrlsFromStorage[chainIdNumber].chosen;
              draft.appProviders[chainIdNumber].urls =
                parsedRpcUrlsFromStorage[chainIdNumber].urls;
              draft.appProviders[chainIdNumber].instance =
                new StaticJsonRpcBatchProvider(
                  parsedRpcUrlsFromStorage[chainIdNumber].chosen,
                );
            }
          });
        }),
      );
    }

    get().syncLocalStorage();
  },
  setChosenProvider: (chainId, url) => {
    set((state) =>
      produce(state, (draft) => {
        draft.appProviders[chainId].chosen = url;
        draft.appProviders[chainId].instance = new StaticJsonRpcBatchProvider(
          url,
        );
      }),
    );

    get().syncLocalStorage();
  },
  addNewRpc: (chainId, url) => {
    set((state) =>
      produce(state, (draft) => {
        if (draft.appProviders[chainId]) {
          draft.appProviders[chainId].urls.push(url);
          draft.appProviders[chainId].instance = new StaticJsonRpcBatchProvider(
            url,
          );
          draft.appProviders[chainId].chosen = url;
        } else {
          draft.appProviders[chainId] = {
            urls: [url],
            instance: new StaticJsonRpcBatchProvider(url),
            chosen: url,
          };
        }
      }),
    );

    get().syncLocalStorage();
  },
  syncLocalStorage: () => {
    const parsedProvidersForLocalStorage = Object.entries(
      get().appProviders,
    ).reduce(
      (acc, [key, value]) => {
        acc[key] = { urls: value.urls, chosen: value.chosen };
        return acc;
      },
      {} as Record<string, AppProviderStorage>,
    );

    setLocalStorageRpcUrls(parsedProvidersForLocalStorage);
  },
});
