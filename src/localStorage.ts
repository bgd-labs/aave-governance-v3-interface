import {
  LocalStorageKeys as Web3LocalStorageKeys,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';

import { AppModeType, IsGaslessVote } from './types';

export enum LocalStorageKeys {
  GaslessVote = 'isGaslessVote',
  TermsAccept = 'termsAccept',
  AppMode = 'appMode',
}

// for UI
export const getLocalStorageLastConnectedWallet = () => {
  return localStorage?.getItem(Web3LocalStorageKeys.LastConnectedWallet) as
    | WalletType
    | undefined;
};

export const getLocalStorageGaslessVote = () => {
  return localStorage?.getItem(LocalStorageKeys.GaslessVote) as IsGaslessVote;
};

export const setLocalStorageGaslessVote = (value: IsGaslessVote) => {
  return localStorage?.setItem(LocalStorageKeys.GaslessVote, value);
};

export const getLocalStorageTermsAccept = () => {
  return localStorage?.getItem(LocalStorageKeys.TermsAccept);
};

export const setLocalStorageTermsAccept = (value: string) => {
  return localStorage?.setItem(LocalStorageKeys.TermsAccept, value);
};

export const getLocalStorageAppMode = () => {
  return localStorage?.getItem(LocalStorageKeys.AppMode) as AppModeType;
};

export const setLocalStorageAppMode = (value: AppModeType) => {
  return localStorage?.setItem(LocalStorageKeys.AppMode, value);
};
