import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { Draft, produce } from 'immer';

import { getDelegateData } from '../components/TutorialModals/getDelegateData';
import { getProposalData } from '../components/TutorialModals/getProposalData';
import { getRepresentationsData } from '../components/TutorialModals/getRepresentationsData';
import {
  generateStatus,
  getTestTransactionsPool,
  makeTestTransaction,
  TransactionItem,
} from '../components/TutorialModals/getTestTransactions';
import {
  getLocalStorageTutorialStartButtonClicked,
  setLocalStorageTutorialStartButtonClicked,
} from '../configs/localStorage';
import {
  DelegateItem,
  RepresentationDataItem,
  RepresentationFormData,
} from '../types';

export type TutorialProposalData = ReturnType<typeof getProposalData>;

export interface ITutorialSlice {
  helpProposalData: TutorialProposalData | undefined;
  getHelpProposalData: () => void;
  setHelpProposalData: (proposalData: TutorialProposalData | undefined) => void;

  helpDelegateData: DelegateItem[];
  setHelpDelegateData: (delegateData: DelegateItem[]) => void;
  getHelpDelegateData: () => void;

  testTransactionsPool: Record<number, TransactionItem>;
  getTestTransactionsPool: () => void;
  addTestTransaction: (timestamp: number) => void;
  resetTestTransactionsPool: () => void;

  helpRepresentationsData: Record<number, RepresentationDataItem>;
  setHelpRepresentationsData: (
    representationsData: RepresentationFormData[],
  ) => void;
  getHelpRepresentationsData: () => void;

  isClickedOnStartButtonOnHelpModal: boolean;
  checkTutorialStartButtonClick: () => void;
  setIsClickedOnStartButtonOnHelpModal: (value: boolean) => void;

  isHelpModalClosed: boolean;
  setIsHelpModalClosed: (value: boolean) => void;

  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (value: boolean) => void;

  isHelpNavigationModalOpen: boolean;
  setIsHelpNavigationModalOpen: (value: boolean) => void;

  isHelpWalletModalOpen: boolean;
  setIsHelpWalletModalOpen: (value: boolean) => void;

  isHelpVotingModalOpen: boolean;
  setIsHelpVotingModalOpen: (value: boolean) => void;

  isHelpDelegateModalOpen: boolean;
  setIsHelpDelegateModalOpen: (value: boolean) => void;

  isHelpRepresentationModalOpen: boolean;
  setIsHelpRepresentationModalOpen: (value: boolean) => void;

  isHelpRepresentativeModalOpen: boolean;
  setIsHelpRepresentativeModalOpen: (value: boolean) => void;

  isHelpStatusesModalOpen: boolean;
  setIsHelpStatusesModalOpen: (value: boolean) => void;

  isHelpVotingPowerModalOpen: boolean;
  setIsHelpVotingPowerModalOpen: (value: boolean) => void;

  isHelpVotingBarsModalOpen: boolean;
  setIsHelpVotingBarsModalOpen: (value: boolean) => void;

  isHelpDelegationVotingPowerModalOpen: boolean;
  setIsHelpDelegationVotingPowerModalOpen: (value: boolean) => void;

  isHelpDelegationPropositionPowerModalOpen: boolean;
  setIsHelpDelegationPropositionPowerModalOpen: (value: boolean) => void;

  closeHelpModals: () => void;
}

export const closeHelpModal = (state: ITutorialSlice) => {
  state.setIsHelpModalClosed(true);
  setTimeout(() => state.setIsHelpModalClosed(false), 1000);
};

export const createTutorialSlice: StoreSlice<ITutorialSlice> = (set, get) => ({
  helpProposalData: undefined,
  getHelpProposalData: () => {
    const proposalData = getProposalData();
    set((state) =>
      produce(state, (draft) => {
        draft.helpProposalData = proposalData as Draft<TutorialProposalData>;
      }),
    );
  },
  setHelpProposalData: (proposalData) => {
    set({ helpProposalData: proposalData });
  },

  helpDelegateData: [],
  setHelpDelegateData: (delegateData) => {
    set({ helpDelegateData: delegateData });
  },
  getHelpDelegateData: () => {
    const delegateData = getDelegateData();
    set({ helpDelegateData: delegateData });
  },

  testTransactionsPool: {},
  getTestTransactionsPool: () => {
    const transactionsPool = getTestTransactionsPool();
    set({ testTransactionsPool: transactionsPool });
  },
  addTestTransaction: (timestamp) => {
    set((state) =>
      produce(state, (draft) => {
        draft.testTransactionsPool[timestamp] = makeTestTransaction(
          timestamp,
          true,
        );
      }),
    );
    setTimeout(() => {
      set((state) =>
        produce(state, (draft) => {
          draft.testTransactionsPool[timestamp] = makeTestTransaction(
            timestamp,
            false,
            generateStatus(),
          );
        }),
      );
    }, 1000);
  },
  resetTestTransactionsPool: () => {
    set({ testTransactionsPool: {} });
  },

  helpRepresentationsData: [],
  setHelpRepresentationsData: (representationsData) => {
    const formattedRepresentationsData = representationsData.reduce<
      Record<number, RepresentationDataItem>
    >((accumulator, representationFormData) => {
      accumulator[representationFormData.chainId] = {
        representative: representationFormData.representative,
        represented: [],
      };

      return accumulator;
    }, {});

    set({ helpRepresentationsData: formattedRepresentationsData });
  },
  getHelpRepresentationsData: () => {
    const representationsData = getRepresentationsData();
    set({ helpRepresentationsData: representationsData });
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

  isHelpModalClosed: false,
  setIsHelpModalClosed: (value) => {
    set({ isHelpModalClosed: value });
  },

  isHelpModalOpen: false,
  setIsHelpModalOpen: (value) => {
    if (get().isClickedOnStartButtonOnHelpModal) {
      set({ isHelpNavigationModalOpen: value });

      if (!get().isHelpNavigationModalOpen) {
        closeHelpModal(get());
      }
    } else {
      set({ isHelpModalOpen: value });

      if (!get().isHelpModalOpen) {
        closeHelpModal(get());
      }
    }
  },

  isHelpNavigationModalOpen: false,
  setIsHelpNavigationModalOpen: (value) => {
    set({
      isHelpNavigationModalOpen: value,
      isHelpModalOpen: false,
    });
    if (!get().isHelpModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpWalletModalOpen: false,
  setIsHelpWalletModalOpen: (value) => {
    set({
      isHelpWalletModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpWalletModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpVotingModalOpen: false,
  setIsHelpVotingModalOpen: (value) => {
    set({
      isHelpVotingModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpVotingModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpDelegateModalOpen: false,
  setIsHelpDelegateModalOpen: (value) => {
    set({
      isHelpDelegateModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpDelegateModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpRepresentationModalOpen: false,
  setIsHelpRepresentationModalOpen: (value) => {
    set({
      isHelpRepresentationModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpRepresentationModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpRepresentativeModalOpen: false,
  setIsHelpRepresentativeModalOpen: (value) => {
    set({
      isHelpRepresentativeModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpRepresentativeModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpStatusesModalOpen: false,
  setIsHelpStatusesModalOpen: (value) => {
    set({
      isHelpStatusesModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpStatusesModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpVotingPowerModalOpen: false,
  setIsHelpVotingPowerModalOpen: (value) => {
    set({
      isHelpVotingPowerModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpVotingPowerModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpVotingBarsModalOpen: false,
  setIsHelpVotingBarsModalOpen: (value) => {
    set({
      isHelpVotingBarsModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpVotingBarsModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpDelegationVotingPowerModalOpen: false,
  setIsHelpDelegationVotingPowerModalOpen: (value) => {
    set({
      isHelpDelegationVotingPowerModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpDelegationVotingPowerModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpDelegationPropositionPowerModalOpen: false,
  setIsHelpDelegationPropositionPowerModalOpen: (value) => {
    set({
      isHelpDelegationPropositionPowerModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpDelegationPropositionPowerModalOpen) {
      closeHelpModal(get());
    }
  },

  closeHelpModals: () => {
    set({
      isHelpNavigationModalOpen: false,
      isHelpModalOpen: false,
      isHelpWalletModalOpen: false,
      isHelpVotingModalOpen: false,
      isHelpDelegateModalOpen: false,
      isHelpRepresentationModalOpen: false,
      isHelpRepresentativeModalOpen: false,
      isHelpStatusesModalOpen: false,
      isHelpVotingPowerModalOpen: false,
      isHelpVotingBarsModalOpen: false,
      isHelpDelegationVotingPowerModalOpen: false,
      isHelpDelegationPropositionPowerModalOpen: false,
    });
    closeHelpModal(get());
  },
});
