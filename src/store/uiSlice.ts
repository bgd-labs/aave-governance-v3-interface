import { IWalletSlice, StoreSlice } from '@bgd-labs/frontend-web3-utils';

import { isForIPFS, isTermsAndConditionsVisible } from '../configs/appConfig';
import {
  getLocalStorageAppMode,
  getLocalStorageGaslessVote,
  getLocalStorageTermsAccept,
  getLocalStorageTutorialStartButtonClicked,
  setLocalStorageAppMode,
  setLocalStorageGaslessVote,
  setLocalStorageTermsAccept,
  setLocalStorageTutorialStartButtonClicked,
} from '../configs/localStorage';
import { AppModeType } from '../types';
import { TransactionsSlice } from './transactionsSlice';

export interface IUISlice {
  isGaslessVote: boolean;
  checkIsGaslessVote: (chainId: number) => void;
  setIsGaslessVote: (value: boolean) => void;

  isRendered: boolean;
  setIsRendered: () => void;

  isThemeSwitched: boolean;
  setIsThemeSwitched: () => void;

  isAppBlockedByTerms: boolean;
  checkIsAppBlockedByTerms: () => void;
  setIsTermsAccept: (value: boolean) => void;

  appMode: AppModeType;
  checkAppMode: () => void;
  setAppMode: (appMode: AppModeType) => void;

  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;

  isTermModalOpen: boolean;
  setIsTermModalOpen: (value: boolean) => void;

  isClickedOnStartButtonOnHelpModal: boolean;
  checkTutorialStartButtonClick: () => void;
  setIsClickedOnStartButtonOnHelpModal: (value: boolean) => void;

  isExecutePayloadModalOpen: boolean;
  setExecutePayloadModalOpen: (value: boolean) => void;
}

export const createUISlice: StoreSlice<
  IUISlice,
  IWalletSlice & TransactionsSlice
> = (set, get) => ({
  isGaslessVote: true,
  checkIsGaslessVote: (chainId) => {
    if (
      get().isGelatoAvailableChains[chainId] &&
      !get().activeWallet?.isContractAddress
    ) {
      if (getLocalStorageGaslessVote() === 'on') {
        set({ isGaslessVote: true });
      } else if (getLocalStorageGaslessVote() === 'off') {
        set({ isGaslessVote: false });
      } else {
        set({ isGaslessVote: true });
      }
    } else {
      set({ isGaslessVote: false });
    }
  },
  setIsGaslessVote: (value) => {
    setLocalStorageGaslessVote(value ? 'on' : 'off');
    set({ isGaslessVote: value });
  },

  isRendered: false,
  setIsRendered: () => set({ isRendered: true }),

  isThemeSwitched: false,
  setIsThemeSwitched: () => {
    set({ isThemeSwitched: true });
    setTimeout(() => set({ isThemeSwitched: false }), 100);
  },

  isAppBlockedByTerms: false,
  checkIsAppBlockedByTerms: () => {
    if (
      getLocalStorageTermsAccept() !== 'true' &&
      !isForIPFS &&
      isTermsAndConditionsVisible
    ) {
      set({ isAppBlockedByTerms: true });
    } else {
      set({ isAppBlockedByTerms: false });
    }
  },
  setIsTermsAccept: (value: boolean) => {
    if (value) {
      setLocalStorageTermsAccept('true');
      set({ isAppBlockedByTerms: false });
    }
  },

  appMode: 'default',
  checkAppMode: () => {
    if (get().activeWallet?.isContractAddress) {
      setLocalStorageAppMode('default');
      set({ appMode: 'default' });
    } else {
      const localStorageAppMode = getLocalStorageAppMode();
      if (localStorageAppMode) {
        set({ appMode: localStorageAppMode });
      } else {
        setLocalStorageAppMode('default');
        set({ appMode: 'default' });
      }
    }
  },
  setAppMode: (appMode) => {
    if (get().activeWallet?.isContractAddress) {
      setLocalStorageAppMode('default');
      set({ appMode: 'default' });
    } else {
      setLocalStorageAppMode(appMode);
      set({ appMode });
    }
  },

  isModalOpen: false,
  setModalOpen: (value) => {
    set({ isModalOpen: value });
  },

  isTermModalOpen: false,
  setIsTermModalOpen: (value) => {
    set({ isModalOpen: value, isTermModalOpen: value });
  },

  isClickedOnStartButtonOnHelpModal: false,
  checkTutorialStartButtonClick: () => {
    const localStorageTutorialStartButtonClick =
      getLocalStorageTutorialStartButtonClicked();

    if (localStorageTutorialStartButtonClick) {
      set({
        isClickedOnStartButtonOnHelpModal:
          localStorageTutorialStartButtonClick === 'true',
      });
    } else {
      setLocalStorageTutorialStartButtonClicked('false');
      set({ isClickedOnStartButtonOnHelpModal: false });
    }
  },
  setIsClickedOnStartButtonOnHelpModal: (value) => {
    setLocalStorageTutorialStartButtonClicked(`${value}`);
    set({ isClickedOnStartButtonOnHelpModal: value });
  },

  isExecutePayloadModalOpen: false,
  setExecutePayloadModalOpen: (value) => {
    set({ isModalOpen: value, isExecutePayloadModalOpen: value });
  },
});
