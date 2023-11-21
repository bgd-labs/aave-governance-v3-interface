import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex } from 'viem';

import {
  getLocalStorageEnsAddresses,
  setLocalStorageEnsAddresses,
} from '../../utils/localStorage';
import { getAddress, getAvatar, getName } from '../utils/ensHelpers';
import { ENSDataHasBeenFetched } from './ensSelectors';

export enum ENSProperty {
  NAME = 'name',
  AVATAR = 'avatar',
}

export type EnsDataItem = {
  name?: string;
  avatar?: {
    url?: string;
    isExists?: boolean;
  };
  fetched?: {
    name?: number;
    avatar?: number;
  };
};

export interface IEnsSlice {
  ensData: Record<Hex, EnsDataItem>;
  addressesNameInProgress: Record<string, boolean>;
  addressesAvatarInProgress: Record<string, boolean>;

  initEns: () => void;
  setEns: (ens: Record<string, EnsDataItem>) => void;
  setProperty: (
    address: Hex,
    property: ENSProperty,
    value?: string,
    isExists?: boolean,
  ) => void;

  fetchEnsNameByAddress: (address: Hex) => Promise<void>;
  fetchEnsAvatarByAddress: (address: Hex, name?: string) => Promise<void>;
  fetchAddressByEnsName: (name: string) => Promise<Hex | undefined>;
}

export const createEnsSlice: StoreSlice<IEnsSlice> = (set, get) => ({
  ensData: {},
  addressesNameInProgress: {},
  addressesAvatarInProgress: {},

  initEns: () => {
    const ens = getLocalStorageEnsAddresses();
    if (ens) {
      set((state) =>
        produce(state, (draft) => {
          const parsedEns: Record<Hex, EnsDataItem> = JSON.parse(ens);
          for (const key in parsedEns) {
            draft.ensData[key as Hex] = parsedEns[key as Hex];
          }
        }),
      );
    }
  },
  setEns: (ens) => {
    set((state) =>
      produce(state, (draft) => {
        for (const key in ens) {
          draft.ensData[key as Hex] = ens[key];
        }
      }),
    );
    setLocalStorageEnsAddresses(get().ensData);
  },
  setProperty: (address, property, value, isExists) => {
    set((state) =>
      produce(state, (draft) => {
        const currentEntry = draft.ensData[address] || {};

        if (property === ENSProperty.AVATAR) {
          currentEntry[property] = { url: value, isExists };
        } else {
          currentEntry[property] = value;
        }

        currentEntry.fetched = currentEntry.fetched || {};
        currentEntry.fetched[property] = dayjs().unix();
        draft.ensData[address] = currentEntry;
      }),
    );
    setTimeout(() => setLocalStorageEnsAddresses(get().ensData), 1);
  },

  fetchEnsNameByAddress: async (address) => {
    const lowercasedAddress = address.toLocaleLowerCase() as Hex;
    // check if already exist or pending
    if (
      ENSDataHasBeenFetched(get(), lowercasedAddress, ENSProperty.NAME) ||
      get().addressesNameInProgress[lowercasedAddress]
    ) {
      return;
    }

    set((state) =>
      produce(state, (draft) => {
        draft.addressesNameInProgress[lowercasedAddress] = true;
      }),
    );

    const name = await getName(lowercasedAddress);

    set((state) =>
      produce(state, (draft) => {
        delete draft.addressesNameInProgress[lowercasedAddress];
      }),
    );

    get().setProperty(lowercasedAddress, ENSProperty.NAME, name);
  },
  fetchEnsAvatarByAddress: async (address, name) => {
    const lowercasedAddress = address.toLocaleLowerCase() as Hex;
    // check if already exist or pending
    if (
      ENSDataHasBeenFetched(get(), lowercasedAddress, ENSProperty.AVATAR) ||
      get().addressesAvatarInProgress[lowercasedAddress] ||
      !name
    ) {
      return;
    }

    set((state) =>
      produce(state, (draft) => {
        draft.addressesAvatarInProgress[lowercasedAddress] = true;
      }),
    );

    const avatar = await getAvatar(name, address);
    let isExists: boolean | undefined = undefined;

    if (avatar) {
      const avatarResponseStatus = (await fetch(avatar)).status;
      isExists = avatarResponseStatus === 200;
    }

    set((state) =>
      produce(state, (draft) => {
        delete draft.addressesAvatarInProgress[lowercasedAddress];
      }),
    );

    get().setProperty(lowercasedAddress, ENSProperty.AVATAR, avatar, isExists);
  },
  fetchAddressByEnsName: async (name) => {
    const address = Object.keys(get().ensData).find(
      (address) =>
        get().ensData[address.toLocaleLowerCase() as Hex].name === name,
    ) as Hex | undefined;

    if (address) {
      return address;
    }

    set((state) =>
      produce(state, (draft) => {
        draft.addressesNameInProgress[name] = true;
      }),
    );

    const addressFromEns = await getAddress(name);

    set((state) =>
      produce(state, (draft) => {
        delete draft.addressesNameInProgress[name];
      }),
    );

    if (addressFromEns) {
      get().setProperty(
        addressFromEns.toLocaleLowerCase() as Hex,
        ENSProperty.NAME,
        name,
      );
      return addressFromEns as Hex;
    }

    return;
  },
});
