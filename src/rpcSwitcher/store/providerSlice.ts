import { ChainIdByName } from '@bgd-labs/aave-governance-ui-helpers/src';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils/src';
import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils/src/utils/StaticJsonRpcBatchProvider';
import { AddEthereumChainParameter } from '@web3-react/types';
import { produce } from 'immer';

import {
  getLocalStorageRpcUrls,
  setLocalStorageRpcUrls,
} from '../../utils/localStorage';
import { IWeb3Slice } from '../../web3/store/web3Slice';

export type AppProvider = {
  instance: StaticJsonRpcBatchProvider;
  rpcUrl: string;
};

export type RpcSwitcherFormData = { chainId: number; rpcUrl: string }[];

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
  initProviders: (
    providers: ChainInfo,
    appUsedNetworks: ChainIdByName[],
  ) => void;
  // setProviders: (providers: Record<number, string>) => void;
  updateProviders: (formData: RpcSwitcherFormData) => void;
  syncLocalStorage: () => void;
  syncDataServices: () => void;
  appProvidersStorage: Record<number, AppProviderStorage>;
  syncAppProviderStorage: () => void;
}

export const createProviderSlice: StoreSlice<IProviderSlice, IWeb3Slice> = (
  set,
  get,
) => ({
  appProviders: {},
  appProvidersStorage: {},
  initProviders: (providers, appUsedNetworks) => {
    set((state) =>
      produce(state, (draft) => {
        Object.keys(providers.urls)
          .filter((chainId) => appUsedNetworks.includes(Number(chainId)))
          .forEach((chainId) => {
            const chainIdNumber = Number(chainId);

            draft.appProviders[chainIdNumber] = {
              rpcUrl: providers.getChainParameters(chainIdNumber).rpcUrls[0],
              instance: providers.providerInstances[chainIdNumber].instance,
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
          Object.keys(parsedRpcUrlsFromStorage)
            .filter((chainId) => appUsedNetworks.includes(Number(chainId)))
            .forEach((chainId) => {
              const chainIdNumber = Number(chainId);
              if (
                draft.appProviders[chainIdNumber] &&
                draft.appProviders[chainIdNumber].rpcUrl !==
                  parsedRpcUrlsFromStorage[chainIdNumber].rpcUrl
              ) {
                draft.appProviders[chainIdNumber].rpcUrl =
                  parsedRpcUrlsFromStorage[chainIdNumber].rpcUrl;
                draft.appProviders[chainIdNumber].instance =
                  new StaticJsonRpcBatchProvider(
                    parsedRpcUrlsFromStorage[chainIdNumber].rpcUrl,
                  );
              }
            });
        }),
      );
    }
    get().syncLocalStorage();
    get().syncDataServices();
    get().syncAppProviderStorage();
  },
  updateProviders: (formData) => {
    formData.forEach(({ chainId, rpcUrl }) => {
      set((state) =>
        produce(state, (draft) => {
          draft.appProviders[chainId].rpcUrl = rpcUrl;
          draft.appProviders[chainId].instance = new StaticJsonRpcBatchProvider(
            rpcUrl,
          );
        }),
      );
    });

    get().syncLocalStorage();
    get().syncDataServices();
    get().syncAppProviderStorage();
  },
  syncLocalStorage: () => {
    const parsedProvidersForLocalStorage = Object.entries(
      get().appProviders,
    ).reduce(
      (acc, [key, value]) => {
        acc[key] = { rpcUrl: value.rpcUrl };
        return acc;
      },
      {} as Record<string, AppProviderStorage>,
    );

    setLocalStorageRpcUrls(parsedProvidersForLocalStorage);
  },
  syncDataServices: () => {
    const providers = Object.entries(get().appProviders).reduce(
      (acc, [key, value]) => {
        acc[key] = value.instance;
        return acc;
      },
      {} as Record<string, StaticJsonRpcBatchProvider>,
    );
    get().initDataServices(providers);
  },
  syncAppProviderStorage: () => {
    const parsedProvidersForLocalStorage = Object.entries(
      get().appProviders,
    ).reduce(
      (acc, [key, value]) => {
        acc[key] = { rpcUrl: value.rpcUrl };
        return acc;
      },
      {} as Record<string, AppProviderStorage>,
    );

    set({ appProvidersStorage: parsedProvidersForLocalStorage });
  },
});
