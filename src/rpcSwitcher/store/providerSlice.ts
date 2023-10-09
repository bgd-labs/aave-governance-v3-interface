import { ChainIdByName } from '@bgd-labs/aave-governance-ui-helpers/src';
import { IPayloadsControllerCore__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IPayloadsControllerCore__factory';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils/src';
import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils/src/utils/StaticJsonRpcBatchProvider';
import { AddEthereumChainParameter } from '@web3-react/types';
import { ethers } from 'ethers';
import { produce } from 'immer';

import { appConfig } from '../../utils/appConfig';
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
  appProvidersForm: Record<number, AppProviderStorage>;
  initProviders: (
    providers: ChainInfo,
    appUsedNetworks: ChainIdByName[],
  ) => void;
  updateProviders: (formData: RpcSwitcherFormData) => void;
  syncLocalStorage: () => void;
  syncDataServices: () => void;
  syncAppProviderForm: () => void;

  checkRpcUrl: (rpcUrl: string, chainId: number) => Promise<void>;
  rpcHasError: { [rpcUrl: string]: { error: boolean; chainId: number } };
}

export const createProviderSlice: StoreSlice<IProviderSlice, IWeb3Slice> = (
  set,
  get,
) => ({
  appProviders: {},
  appProvidersForm: {},
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
    get().syncAppProviderForm();
    Object.keys(get().appProvidersForm).forEach((chainId) => {
      set((state) =>
        produce(state, (draft) => {
          const rpcUrl = draft.appProvidersForm[+chainId].rpcUrl;
          draft.rpcHasError[rpcUrl] = {
            error: false,
            chainId: +chainId,
          };
        }),
      );
    });
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
    get().syncAppProviderForm();
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
  syncAppProviderForm: () => {
    const parsedProvidersForLocalStorage = Object.entries(
      get().appProviders,
    ).reduce(
      (acc, [key, value]) => {
        acc[key] = { rpcUrl: value.rpcUrl };
        return acc;
      },
      {} as Record<string, AppProviderStorage>,
    );

    set({ appProvidersForm: parsedProvidersForLocalStorage });
  },
  checkRpcUrl: async (rpcUrl, chainId) => {
    if (
      get().rpcHasError.hasOwnProperty(rpcUrl) &&
      get().rpcHasError[rpcUrl].chainId === chainId
    ) {
      return;
    }
    try {
      const provider = new ethers.providers.StaticJsonRpcProvider(
        rpcUrl,
        chainId,
      );
      const contractAddresses =
        appConfig.payloadsControllerConfig[chainId].contractAddresses;
      const lastPayloadsController =
        contractAddresses[contractAddresses.length - 1];
      const payloadsControllerContract =
        IPayloadsControllerCore__factory.connect(
          lastPayloadsController,
          provider,
        );
      await payloadsControllerContract.getPayloadsCount();
      set((state) =>
        produce(state, (draft) => {
          draft.rpcHasError[rpcUrl] = {
            error: false,
            chainId: chainId,
          };
        }),
      );
    } catch {
      set((state) =>
        produce(state, (draft) => {
          draft.rpcHasError[rpcUrl] = {
            error: true,
            chainId: chainId,
          };
        }),
      );
    }
  },
  rpcHasError: {},
});
