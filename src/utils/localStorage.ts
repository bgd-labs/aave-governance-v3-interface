import {
  LocalStorageKeys as Web3LocalStorageKeys,
  WalletType,
} from '@bgd-labs/frontend-web3-utils/src';

import { RepresentativeAddress } from '../representations/store/representationsSlice';
import { AppProviderStorage } from '../rpcSwitcher/store/providerSlice';
import { IsHelpModalVisible } from '../ui/helpModals/HelpModalProvider';
import { AppModeType, IsGaslessVote } from '../ui/store/uiSlice';
import { EnsDataItem } from '../web3/store/ensSlice';

export enum LocalStorageKeys {
  EnsAddresses = 'EnsAddresses',
  RpcUrls = 'RpcUrls',
  RepresentingAddresses = 'representingAddresses',
  HelpModalVisible = 'isHelpModalVisible',
  GaslessVote = 'isGaslessVote',
  TermsAccept = 'termsAccept',
  AppMode = 'appMode',
  TutorialStartButtonClicked = 'tutorialStartButtonClicked',
}

// for ENS
export const getLocalStorageEnsAddresses = () => {
  return localStorage?.getItem(LocalStorageKeys.EnsAddresses);
};

export const setLocalStorageEnsAddresses = (
  ensAddresses: Record<string, EnsDataItem>,
) => {
  localStorage?.setItem(
    LocalStorageKeys.EnsAddresses,
    JSON.stringify(ensAddresses),
  );
};

// for RPC switcher
export const getLocalStorageRpcUrls = () => {
  return localStorage?.getItem(LocalStorageKeys.RpcUrls);
};

export const setLocalStorageRpcUrls = (
  rpcUrls: Record<number, AppProviderStorage>,
) => {
  localStorage?.setItem(LocalStorageKeys.RpcUrls, JSON.stringify(rpcUrls));
};

// for representations
export const getLocalStorageRepresentingAddresses = () => {
  const addresses = localStorage?.getItem(
    LocalStorageKeys.RepresentingAddresses,
  );

  return (!!addresses ? JSON.parse(addresses) : {}) as Record<
    string,
    RepresentativeAddress
  >;
};

export const setLocalStorageRepresentingAddresses = (
  addresses: Record<string, RepresentativeAddress>,
) => {
  return localStorage?.setItem(
    LocalStorageKeys.RepresentingAddresses,
    JSON.stringify(addresses),
  );
};

// for UI
export const getLocalStorageLastConnectedWallet = () => {
  return localStorage?.getItem(Web3LocalStorageKeys.LastConnectedWallet) as
    | WalletType
    | undefined;
};

export const getLocalStorageIsHelpModalVisible = () => {
  return localStorage?.getItem(
    LocalStorageKeys.HelpModalVisible,
  ) as IsHelpModalVisible;
};

export const setLocalStorageIsHelpModalVisible = (
  value: IsHelpModalVisible,
) => {
  return localStorage?.setItem(LocalStorageKeys.HelpModalVisible, value);
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

export const getLocalStorageTutorialStartButtonClicked = () => {
  return localStorage?.getItem(LocalStorageKeys.TutorialStartButtonClicked);
};

export const setLocalStorageTutorialStartButtonClicked = (value: string) => {
  return localStorage?.setItem(
    LocalStorageKeys.TutorialStartButtonClicked,
    value,
  );
};
