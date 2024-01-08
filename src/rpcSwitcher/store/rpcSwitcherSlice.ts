import {
  blockLimit,
  getPayloadsCreated,
  payloadsControllerContract as payloadsControllerContractInit,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { PublicClient } from '@wagmi/core';
import { Draft, produce } from 'immer';
import { Chain, zeroAddress, zeroHash } from 'viem';
import { mainnet } from 'viem/chains';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { appConfig } from '../../utils/appConfig';
import { createViemClient } from '../../utils/chains';
import { chainInfoHelper } from '../../utils/configs';
import {
  getLocalStorageRpcUrls,
  setLocalStorageRpcUrls,
} from '../../utils/localStorage';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { getProof } from '../../web3/utils/helperToGetProofs';
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

export type SetRpcErrorParams = {
  isError: boolean;
  rpcUrl: string;
  chainId: number;
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

  rpcAppErrors: Record<
    number,
    { error: boolean; rpcUrl: string; chainId: number }
  >;
  setRpcError: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void;

  setRpcFormError: ({ isError, rpcUrl, chainId }: SetRpcErrorParams) => void;
  rpcFormErrors: Record<string, { error: boolean; chainId: number }>;
  checkRpcUrl: (rpcUrl: string, chainId: number) => Promise<void>;
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
      ) &&
      appUsedNetworks.length ===
        Object.keys(JSON.parse(rpcUrlsFromStorage)).length
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
              const chain = clients.getChainParameters(chainIdNumber);

              if (chain) {
                draft.appClients[chainIdNumber] = {
                  rpcUrl: parsedRpcUrlsFromStorage[chainIdNumber].rpcUrl,
                  instance: createViemClient(
                    chain,
                    parsedRpcUrlsFromStorage[chainIdNumber].rpcUrl,
                  ),
                };
              }
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
      const rpcUrl = get().appClientsForm[+chainId].rpcUrl;
      get().setRpcError({ isError: false, rpcUrl, chainId: +chainId });
      get().setRpcFormError({ isError: false, rpcUrl, chainId: +chainId });
    });

    set({ initClientsLoaded: true });
  },
  updateClients: (formData) => {
    formData.forEach(({ chainId, rpcUrl }) => {
      set((state) =>
        produce(state, (draft) => {
          draft.appClients[chainId].rpcUrl = rpcUrl;
          draft.appClients[chainId].instance = createViemClient(
            chainInfoHelper.getChainParameters(chainId),
            rpcUrl,
          );
        }),
      );
    });

    get().syncTransactionsClients();
    get().syncLocalStorage();
    get().syncDataServices();
    get().syncAppClientsForm();

    Object.values(formData).forEach((data) => {
      get().setRpcError({
        isError: false,
        rpcUrl: data.rpcUrl,
        chainId: data.chainId,
      });
      get().setRpcFormError({
        isError: false,
        rpcUrl: data.rpcUrl,
        chainId: data.chainId,
      });
    });
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

  rpcAppErrors: {},
  setRpcError: ({ isError, rpcUrl, chainId }) => {
    if (!!rpcUrl && !!chainId) {
      set((state) =>
        produce(state, (draft) => {
          draft.rpcAppErrors[chainId] = {
            error: isError,
            rpcUrl,
            chainId,
          };
        }),
      );
    }
  },

  rpcFormErrors: {},
  setRpcFormError: ({ isError, rpcUrl, chainId }) => {
    set((state) =>
      produce(state, (draft) => {
        draft.rpcFormErrors[rpcUrl] = {
          error: isError,
          chainId: chainId,
        };
      }),
    );
  },
  checkRpcUrl: async (rpcUrl, chainId) => {
    if (
      get().rpcFormErrors.hasOwnProperty(rpcUrl) &&
      get().rpcFormErrors[rpcUrl].chainId === chainId
    ) {
      return;
    }
    const client = createViemClient(
      chainInfoHelper.getChainParameters(chainId),
      rpcUrl,
      true,
    );

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
        get().setRpcFormError({ isError: false, rpcUrl, chainId });

        // check get proofs if initial request success and chainId it's mainnet
        if (mainnet.id === chainId) {
          try {
            await getProof(
              client,
              zeroAddress,
              [zeroHash],
              Number(currentBlock.number),
            );

            get().setRpcFormError({ isError: false, rpcUrl, chainId });
          } catch {
            get().setRpcFormError({ isError: true, rpcUrl, chainId });
          }
        }
      } catch {
        get().setRpcFormError({ isError: true, rpcUrl, chainId });
      }
    } catch {
      get().setRpcFormError({ isError: true, rpcUrl, chainId });
    }
  },
});
