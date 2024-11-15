import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book';
import {
  blockLimit,
  getPayloadsCreated,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { Draft, produce } from 'immer';
import { Client, getContract, zeroAddress, zeroHash } from 'viem';
import { getBlock, getProof } from 'viem/actions';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { initialRpcUrls } from '../configs/chains';
import { chainInfoHelper } from '../configs/configs';
import {
  getLocalStorageRpcUrls,
  setLocalStorageRpcUrls,
} from '../configs/localStorage';
import {
  AppClient,
  AppClientsStorage,
  ChainInfo,
  RpcSwitcherFormData,
  SetRpcErrorParams,
} from '../types';
import { createViemClient } from '../utils/createClient';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { TransactionsSlice } from './transactionsSlice';
import { IWeb3Slice } from './web3Slice';

export interface IRpcSwitcherSlice {
  appClients: Record<number, AppClient>;
  appClientsForm: Record<number, AppClientsStorage>;
  initClientsLoaded: boolean;
  initClients: (clients: ChainInfo, appUsedNetworks: number[]) => void;
  updateClients: (formData: RpcSwitcherFormData) => void;
  syncTransactionsClients: () => void;
  syncLocalStorage: () => void;
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
                  instance: createViemClient({
                    chain,
                    rpcUrl: parsedRpcUrlsFromStorage[chainIdNumber].rpcUrl,
                    initialRpcUrls,
                  }),
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
                  .instance as Draft<Client>,
              };
            });
        }),
      );
      get().syncLocalStorage();
    }

    get().syncTransactionsClients();
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
          draft.appClients[chainId].instance = createViemClient({
            chain: chainInfoHelper.getChainParameters(chainId),
            rpcUrl,
            initialRpcUrls,
          });
        }),
      );
    });

    get().syncTransactionsClients();
    get().syncLocalStorage();
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
    const client = createViemClient({
      chain: chainInfoHelper.getChainParameters(chainId),
      rpcUrl,
      initialRpcUrls,
      withoutFallback: true,
    });

    const contractAddresses =
      appConfig.payloadsControllerConfig[chainId].contractAddresses;
    const lastPayloadsController =
      contractAddresses[contractAddresses.length - 1];
    const payloadsControllerContract = getContract({
      abi: IPayloadsControllerCore_ABI,
      address: lastPayloadsController,
      client,
    });

    try {
      // initial request to our contract
      await payloadsControllerContract.read.getPayloadsCount();
      // check get logs if initial request success
      try {
        const currentBlock = await getBlock(client, { blockTag: 'latest' });

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
            await getProof(client, {
              address: zeroAddress,
              storageKeys: [zeroHash],
              blockNumber: currentBlock.number,
            });

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
