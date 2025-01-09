import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import isEqual from 'lodash/isEqual';
import { Address, zeroAddress } from 'viem';

import { appConfig, isForIPFS } from '../configs/appConfig';
import {
  getLocalStorageRepresentingAddresses,
  setLocalStorageRepresentingAddresses,
} from '../configs/localStorage';
import { getFormattedRepresentedAddresses } from '../helpers/getRepresentedAddresses';
import { fetchRepresentationsData } from '../requests/fetchRepresentationsData';
import { updateRepresentatives } from '../transactions/actions/updateRepresentatives';
import { api } from '../trpc/client';
import {
  RepresentationDataItem,
  RepresentationFormData,
  RepresentativeAddress,
} from '../types';
import { IEnsSlice } from './ensSlice';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectInputToAddress } from './selectors/ensSelectors';
import { TransactionsSlice, TxType } from './transactionsSlice';
import { IWeb3Slice } from './web3Slice';

export interface IRepresentationsSlice {
  representationData: Record<number, RepresentationDataItem>;
  representationDataLoading: boolean;
  getRepresentationData: (rpcOnly?: boolean) => Promise<void>;

  representativeLoading: boolean;
  representative: RepresentativeAddress;
  getRepresentingAddress: () => void;
  setRepresentativeAddress: (address: Address, chainsIds: number[]) => void;

  updateRepresentatives: (
    initialData: RepresentationFormData[],
    formData: RepresentationFormData[],
    timestamp: number,
  ) => Promise<void>;

  // for validation
  incorrectRepresentationFields: string[];
  addIncorrectRepresentationField: (field: string) => void;
  removeIncorrectRepresentationField: (field: string) => void;
  clearIncorrectRepresentationFields: () => void;

  // for modals
  isRepresentationsModalOpen: boolean;
  setRepresentationsModalOpen: (value: boolean) => void;

  isRepresentationsChangedView: boolean;
  setIsRepresentationsChangedView: (value: boolean) => void;

  isRepresentationInfoModalOpen: boolean;
  setIsRepresentationInfoModalOpen: (value: boolean) => void;
}

export const createRepresentationsSlice: StoreSlice<
  IRepresentationsSlice,
  IWeb3Slice & TransactionsSlice & IEnsSlice & IRpcSwitcherSlice
> = (set, get) => ({
  representationData: {},
  representationDataLoading: false,
  getRepresentationData: async (rpcOnly) => {
    const activeAddress = get().activeWallet?.address;
    const appClient = get().appClients[appConfig.govCoreChainId];

    if (activeAddress) {
      set({ representationDataLoading: true });

      try {
        const data = await (isForIPFS
          ? fetchRepresentationsData({
              input: {
                address: activeAddress,
                govCoreClient: appClient.instance,
                rpcOnly,
              },
            })
          : api.representations.get.query({ address: activeAddress, rpcOnly }));

        appConfig.votingMachineChainIds.forEach((chainId) => {
          const represented = data.represented
            .filter((item) => Number(item.chainId) === chainId)
            .map((item) => item.votersRepresented)
            .flat();

          const representative = data.representative
            .filter((item) => Number(item.chainId) === chainId)
            .map((item) => item.representative)[0];

          const formattedRepresentative =
            representative === zeroAddress || representative === activeAddress
              ? ''
              : representative;

          set((state) =>
            produce(state, (draft) => {
              draft.representationData[chainId] = {
                representative: formattedRepresentative,
                represented: represented,
              };
            }),
          );

          setTimeout(() => set({ representationDataLoading: false }), 1);
          get().setRpcError({
            isError: false,
            rpcUrl: appClient.rpcUrl,
            chainId: appConfig.govCoreChainId,
          });
        });
      } catch {
        get().setRpcError({
          isError: true,
          rpcUrl: appClient.rpcUrl,
          chainId: appConfig.govCoreChainId,
        });
        setTimeout(() => set({ representationDataLoading: false }), 1);
      }
    } else {
      set({ representativeLoading: false });
    }
  },

  representativeLoading: true,
  representative: {
    chainsIds: [],
    address: '',
  },
  getRepresentingAddress: async () => {
    set({ representativeLoading: true });

    const activeAddress = get().activeWallet?.address;
    const addresses = getLocalStorageRepresentingAddresses();
    const data = get().representationData;

    if (activeAddress && !!Object.keys(data).length) {
      const walletRepresentative = addresses[activeAddress];

      const formattedRepresentedAddresses =
        getFormattedRepresentedAddresses(data);

      const isAddressesValid = formattedRepresentedAddresses.find(
        (address) =>
          address.address.toLowerCase() ===
            walletRepresentative?.address.toLowerCase() &&
          isEqual(address.chainsIds, walletRepresentative?.chainsIds),
      );

      set({
        representative: isAddressesValid
          ? walletRepresentative || { chainsIds: [], address: '' }
          : { chainsIds: [], address: '' },
        representativeLoading: false,
      });
    }
  },
  setRepresentativeAddress: (address, chainsIds) => {
    const activeAddress = get().activeWallet?.address;
    const formattedAddress = !address ? '' : address;
    set((state) =>
      produce(state, (draft) => {
        draft.representative = {
          chainsIds,
          address: formattedAddress,
        };
      }),
    );
    const addresses = getLocalStorageRepresentingAddresses();
    if (!!Object.keys(addresses).length && activeAddress) {
      const newAddresses = {
        ...addresses,
        [activeAddress]: {
          chainsIds,
          address: formattedAddress,
        },
      };
      setLocalStorageRepresentingAddresses(
        newAddresses as Record<string, RepresentativeAddress>,
      );
    } else if (activeAddress) {
      const newAddresses = {
        [activeAddress]: { chainsIds, address: formattedAddress },
      };
      setLocalStorageRepresentingAddresses(
        newAddresses as Record<string, RepresentativeAddress>,
      );
    }
  },

  updateRepresentatives: async (initialData, formData, timestamp) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      const formattedData: {
        representative: Address;
        chainId: bigint;
      }[] = [];
      for await (const item of formData) {
        let representative = item.representative || '';

        // get previous representative data for current chain id
        const initialRepresentativeItem: RepresentationFormData =
          initialData.filter((data) => data.chainId === item.chainId)[0];

        if (initialRepresentativeItem.representative !== representative) {
          representative = await selectInputToAddress({
            store: get(),
            activeAddress,
            addressTo: item.representative,
          });

          formattedData.push({
            representative:
              representative === '' ||
              representative === activeAddress ||
              !item.representative
                ? zeroAddress
                : (representative as Address),
            chainId: BigInt(item.chainId),
          });
        }
      }

      await get().executeTx({
        body: () => {
          return updateRepresentatives({
            wagmiConfig: get().wagmiConfig,
            data: formattedData,
          });
        },
        params: {
          type: TxType.representations,
          desiredChainID: appConfig.govCoreChainId,
          payload: { initialData, data: formData, timestamp },
        },
      });
    }
  },

  incorrectRepresentationFields: [],
  addIncorrectRepresentationField: (field) => {
    set((state) =>
      produce(state, (draft) => {
        draft.incorrectRepresentationFields.push(field);
      }),
    );
  },
  removeIncorrectRepresentationField: (field) => {
    if (get().incorrectRepresentationFields.includes(field)) {
      set((state) => ({
        incorrectRepresentationFields:
          state.incorrectRepresentationFields.filter(
            (incorrectField) => incorrectField !== field,
          ),
      }));
    }
  },
  clearIncorrectRepresentationFields: () => {
    set({ incorrectRepresentationFields: [] });
  },

  isRepresentationsModalOpen: false,
  setRepresentationsModalOpen: (value) => {
    set({ isRepresentationsModalOpen: value });
  },

  isRepresentationsChangedView: false,
  setIsRepresentationsChangedView: (value) => {
    set({ isRepresentationsChangedView: value });
  },

  isRepresentationInfoModalOpen: false,
  setIsRepresentationInfoModalOpen: (value) => {
    set({ isRepresentationInfoModalOpen: value });
  },
});
