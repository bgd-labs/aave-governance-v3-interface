import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import isEqual from 'lodash/isEqual';
import { Hex, zeroAddress } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import {
  TransactionsSlice,
  TxType,
} from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import {
  getLocalStorageRepresentingAddresses,
  setLocalStorageRepresentingAddresses,
} from '../../utils/localStorage';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { getFormattedRepresentedAddresses } from '../utils/getRepresentedAddresses';

export type RepresentationDataItem = {
  representative: Hex | '';
  represented: Hex[];
};

export type RepresentationFormData = {
  chainId: number;
  representative: Hex | '';
};

export type RepresentativeAddress = {
  chainsIds: number[];
  address: Hex | '';
};

export type RepresentedAddress = { chainId: number; address: Hex | '' };

export interface IRepresentationsSlice {
  representativeLoading: boolean;
  representative: RepresentativeAddress;
  getRepresentingAddress: () => void;
  setRepresentativeAddress: (address: Hex, chainsIds: number[]) => void;

  representationData: Record<number, RepresentationDataItem>;
  representationDataLoading: boolean;
  getRepresentationData: () => Promise<void>;
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
}

export const createRepresentationsSlice: StoreSlice<
  IRepresentationsSlice,
  IWeb3Slice &
    TransactionsSlice &
    IProposalsSlice &
    IUISlice &
    IEnsSlice &
    IRpcSwitcherSlice
> = (set, get) => ({
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
      const walletRepresentative: RepresentativeAddress | undefined =
        addresses[activeAddress];

      const formattedRepresentedAddresses =
        getFormattedRepresentedAddresses(data);

      const isAddressesValid = formattedRepresentedAddresses.find(
        (address) =>
          address.address.toLowerCase() ===
            walletRepresentative?.address.toLowerCase() &&
          isEqual(address.chainsIds, walletRepresentative?.chainsIds),
      );

      set({
        representative: !!isAddressesValid
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

  representationData: {},
  representationDataLoading: false,
  getRepresentationData: async () => {
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      set({ representationDataLoading: true });

      const rpcUrl = get().appClients[appConfig.govCoreChainId].rpcUrl;

      try {
        const data =
          await get().govDataService.getRepresentationData(activeAddress);

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
            rpcUrl,
            chainId: appConfig.govCoreChainId,
          });
        });
      } catch {
        get().setRpcError({
          isError: true,
          rpcUrl,
          chainId: appConfig.govCoreChainId,
        });
        setTimeout(() => set({ representationDataLoading: false }), 1);
      }
    } else {
      set({ representativeLoading: false });
    }
  },

  updateRepresentatives: async (initialData, formData, timestamp) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const govDataService = get().govDataService;
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      const formattedData: { representative: Hex; chainId: bigint }[] = [];
      for await (const item of formData) {
        let representative = item.representative;

        // get previous representative data for current chain id
        const initialRepresentativeItem: RepresentationFormData =
          initialData.filter((data) => data.chainId === item.chainId)[0];

        if (initialRepresentativeItem.representative !== representative) {
          if (representative && representative.length < 42) {
            representative =
              (await get().fetchAddressByEnsName(representative)) ||
              representative;
          }

          formattedData.push({
            representative:
              representative === undefined ||
              representative === '' ||
              representative === activeAddress
                ? zeroAddress
                : representative,
            chainId: BigInt(item.chainId),
          });
        }
      }

      await get().executeTx({
        body: () => {
          get().setModalOpen(true);
          return govDataService.updateRepresentatives({ data: formattedData });
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
});
