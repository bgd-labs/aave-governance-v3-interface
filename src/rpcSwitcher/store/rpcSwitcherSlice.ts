import {
  blockLimit,
  getPayloadsCreated,
  payloadsControllerContract as payloadsControllerContractInit,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { PublicClient } from '@wagmi/core';
import { Draft, produce } from 'immer';
import { Chain, createPublicClient, http } from 'viem';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';
import {
  getLocalStorageRpcUrls,
  setLocalStorageRpcUrls,
} from '../../utils/localStorage';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { selectAppClients } from './rpcSwitcherSelectors';

export type AppClient = {
  instance: PublicClient;
  rpcUrl: string;
};

export type RpcSwitcherFormData = { chainId: number; rpcUrl: string }[];

export type AppClientsStorage = Omit<AppClient, 'instance'>;

export type ChainInfo = {
  clientInstances: Record<number, { instance: PublicClient }>;
  getChainParameters: (chainId: number) => Chain;
};

export interface IRpcSwitcherSlice {
  appClients: Record<number, AppClient>;
  appClientsForm: Record<number, AppClientsStorage>;
  initClientsLoaded: boolean;
  initClients: (clients: ChainInfo, appUsedNetworks: number[]) => void;
  updateClients: (formData: RpcSwitcherFormData) => void;
  syncTransactionsClients: () => void;
  syncLocalStorage: () => void;
  syncDataServices: () => void;
  syncAppClientsForm: () => void;

  checkRpcUrl: (rpcUrl: string, chainId: number) => Promise<void>;
  rpcHasError: Record<string, { error: boolean; chainId: number }>;
  setRpcError: (isError: boolean, rpcUrl: string, chainId: number) => void;
}

export const createRpcSwitcherSlice: StoreSlice<
  IRpcSwitcherSlice,
  IWeb3Slice & TransactionsSlice
> = (set, get) => ({
  appClients: {},
  appClientsForm: {},
  initClientsLoaded: false,
  initClients: (clients, appUsedNetworks) => {
    const rpcUrlsFromStorage = getLocalStorageRpcUrls();

    if (
      rpcUrlsFromStorage !== null &&
      rpcUrlsFromStorage !== undefined &&
      !!Object.keys(JSON.parse(rpcUrlsFromStorage)).length &&
      Object.keys(JSON.parse(rpcUrlsFromStorage)).every((chainId) =>
        appUsedNetworks.includes(Number(chainId)),
      )
    ) {
      const parsedRpcUrlsFromStorage = JSON.parse(rpcUrlsFromStorage) as Record<
        number,
        AppClientsStorage
      >;

      set((state) =>
        produce(state, (draft) => {
          Object.keys(parsedRpcUrlsFromStorage)
            .filter((chainId) => appUsedNetworks.includes(Number(chainId)))
            .forEach((chainId) => {
              const chainIdNumber = Number(chainId);

              draft.appClients[chainIdNumber] = {
                rpcUrl: parsedRpcUrlsFromStorage[chainIdNumber].rpcUrl,
                instance: createPublicClient({
                  batch: {
                    multicall: true,
                  },
                  chain: clients.getChainParameters(chainIdNumber),
                  transport: http(
                    parsedRpcUrlsFromStorage[chainIdNumber].rpcUrl,
                  ),
                }) as Draft<PublicClient>,
              };
            });
        }),
      );
    } else {
      set((state) =>
        produce(state, (draft) => {
          Object.keys(clients.clientInstances)
            .filter((chainId) => appUsedNetworks.includes(Number(chainId)))
            .forEach((chainId) => {
              const chainIdNumber = Number(chainId);

              draft.appClients[chainIdNumber] = {
                rpcUrl:
                  clients.getChainParameters(chainIdNumber).rpcUrls.default
                    .http[0],
                instance: clients.clientInstances[chainIdNumber]
                  .instance as Draft<PublicClient>,
              };
            });
        }),
      );
      get().syncLocalStorage();
    }

    get().syncTransactionsClients();
    get().syncDataServices();
    get().syncAppClientsForm();
    Object.keys(get().appClientsForm).forEach((chainId) => {
      set((state) =>
        produce(state, (draft) => {
          const rpcUrl = draft.appClientsForm[+chainId].rpcUrl;
          draft.rpcHasError[rpcUrl] = {
            error: false,
            chainId: +chainId,
          };
        }),
      );
    });

    set({ initClientsLoaded: true });
  },
  updateClients: (formData) => {
    formData.forEach(({ chainId, rpcUrl }) => {
      set((state) =>
        produce(state, (draft) => {
          draft.appClients[chainId].rpcUrl = rpcUrl;
          draft.appClients[chainId].instance = createPublicClient({
            batch: {
              multicall: true,
            },
            chain: chainInfoHelper.getChainParameters(chainId),
            transport: http(rpcUrl),
          }) as Draft<PublicClient>;
        }),
      );
    });

    get().syncTransactionsClients();
    get().syncLocalStorage();
    get().syncDataServices();
    get().syncAppClientsForm();
  },
  syncTransactionsClients: () => {
    const clients = selectAppClients(get());
    Object.entries(clients).forEach((value) => {
      const clientChainId = Number(value[0]);
      const client = value[1];
      get().setClient(clientChainId, client);
    });
  },
  syncLocalStorage: () => {
    const parsedProvidersForLocalStorage = Object.entries(
      get().appClients,
    ).reduce(
      (acc, [key, value]) => {
        acc[key] = { rpcUrl: value.rpcUrl };
        return acc;
      },
      {} as Record<string, AppClientsStorage>,
    );

    setLocalStorageRpcUrls(parsedProvidersForLocalStorage);
  },
  syncDataServices: () => {
    const clients = selectAppClients(get());
    get().initDataServices(clients);
  },
  syncAppClientsForm: () => {
    const parsedProvidersForLocalStorage = Object.entries(
      get().appClients,
    ).reduce(
      (acc, [key, value]) => {
        acc[key] = { rpcUrl: value.rpcUrl };
        return acc;
      },
      {} as Record<string, AppClientsStorage>,
    );

    set({ appClientsForm: parsedProvidersForLocalStorage });
  },

  setRpcError: (isError, rpcUrl, chainId) => {
    set((state) =>
      produce(state, (draft) => {
        draft.rpcHasError[rpcUrl] = {
          error: isError,
          chainId: chainId,
        };
      }),
    );
  },

  checkRpcUrl: async (rpcUrl, chainId) => {
    if (
      get().rpcHasError.hasOwnProperty(rpcUrl) &&
      get().rpcHasError[rpcUrl].chainId === chainId
    ) {
      return;
    }
    const client = createPublicClient({
      batch: {
        multicall: true,
      },
      chain: chainInfoHelper.getChainParameters(chainId),
      transport: http(rpcUrl),
    }) as PublicClient;

    const contractAddresses =
      appConfig.payloadsControllerConfig[chainId].contractAddresses;
    const lastPayloadsController =
      contractAddresses[contractAddresses.length - 1];
    const payloadsControllerContract = payloadsControllerContractInit({
      contractAddress: lastPayloadsController,
      client,
    });

    try {
      // initial request to our contract
      await payloadsControllerContract.read.getPayloadsCount();
      // check get logs if initial request success
      try {
        const currentBlock = await client.getBlock({ blockTag: 'latest' });

        await getPayloadsCreated({
          contractAddress: payloadsControllerContract.address,
          client,
          startBlock: Number(currentBlock.number) - blockLimit,
          endBlock: Number(currentBlock.number),
          chainId,
        });

        get().setRpcError(false, rpcUrl, chainId);
      } catch {
        get().setRpcError(true, rpcUrl, chainId);
      }
    } catch {
      get().setRpcError(true, rpcUrl, chainId);
    }
  },
  rpcHasError: {},
});
