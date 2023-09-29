import { StoreSlice } from '@bgd-labs/frontend-web3-utils/src';
import { ethers } from 'ethers';
import { produce } from 'immer';
import isEqual from 'lodash/isEqual';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { getFormattedRepresentedAddresses } from '../utils/getRepresentedAddresses';

export type RepresentationDataItem = {
  representative: string;
  represented: string[];
};

export type RepresentationFormData = {
  chainId: number;
  representative: string;
};

export type RepresentativeAddress = {
  chainsIds: number[];
  address: string;
};

export type RepresentedAddress = { chainId: number; address: string };

export interface IRepresentationsSlice {
  representativeLoading: boolean;
  representative: RepresentativeAddress;
  getRepresentingAddress: () => void;
  setRepresentativeAddress: (address: string, chainsIds: number[]) => void;

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
  IWeb3Slice & TransactionsSlice & IProposalsSlice & IUISlice & IEnsSlice
> = (set, get) => ({
  representativeLoading: true,
  representative: {
    chainsIds: [],
    address: '',
  },
  getRepresentingAddress: async () => {
    set({ representativeLoading: true });

    const activeAddress = get().activeWallet?.accounts[0];
    const addresses = localStorage.getItem('representingAddresses');
    const data = get().representationData;

    if (activeAddress && !!Object.keys(data).length) {
      const addressesObject = !!addresses ? JSON.parse(addresses) : {};
      const walletRepresentative: RepresentativeAddress | undefined =
        addressesObject[activeAddress] as RepresentativeAddress;

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
    const activeAddress = get().activeWallet?.accounts[0];
    const formattedAddress = !address ? '' : address;
    set((state) =>
      produce(state, (draft) => {
        draft.representative = {
          chainsIds,
          address: formattedAddress,
        };
      }),
    );
    const addresses = localStorage.getItem('representingAddresses');
    if (addresses && activeAddress) {
      const addressesObject = JSON.parse(addresses);
      const stringifiedAddresses = JSON.stringify({
        ...addressesObject,
        [activeAddress]: {
          chainsIds,
          address: formattedAddress,
        },
      });
      localStorage.setItem('representingAddresses', stringifiedAddresses);
    } else if (activeAddress) {
      const stringifiedAddresses = JSON.stringify({
        [activeAddress]: { chainsIds, address: formattedAddress },
      });
      localStorage.setItem('representingAddresses', stringifiedAddresses);
    }
  },

  representationData: {},
  representationDataLoading: false,
  getRepresentationData: async () => {
    const activeAddress = get().activeWallet?.accounts[0];

    if (activeAddress) {
      set({ representationDataLoading: true });

      const data =
        await get().govDataService.getRepresentationData(activeAddress);

      appConfig.votingMachineChainIds.forEach((chainId) => {
        const represented = data.represented
          .filter((item) => item.chainId.toNumber() === chainId)
          .map((item) => item.votersRepresented)
          .flat();

        const representative = data.representative
          .filter((item) => item.chainId.toNumber() === chainId)
          .map((item) => item.representative)[0];

        const formattedRepresentative =
          representative === ethers.constants.AddressZero ||
          representative === activeAddress
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
      });
    } else {
      set({ representativeLoading: false });
    }
  },

  updateRepresentatives: async (initialData, formData, timestamp) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const govDataService = get().govDataService;
    const activeAddress = get().getActiveAddress();

    if (activeAddress) {
      const formattedData: { representative: string; chainId: number }[] = [];
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
                ? ethers.constants.AddressZero
                : representative,
            chainId: item.chainId,
          });
        }
      }

      await get().executeTx({
        body: () => {
          get().setModalOpen(true);
          return govDataService.updateRepresentatives({ data: formattedData });
        },
        params: {
          type: 'representations',
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
