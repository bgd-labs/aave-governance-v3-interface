import { ProposalWithLoadings } from '@bgd-labs/aave-governance-ui-helpers/src';
import { IWalletSlice, StoreSlice } from '@bgd-labs/frontend-web3-utils/src';
import { produce } from 'immer';

import { DelegateItem } from '../../delegate/types';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { isForIPFS, isTermsAndConditionsVisible } from '../../utils/appConfig';
import { getDelegateData } from '../helpModals/getDelegateData';
import { getProposalData } from '../helpModals/getProposalData';
import {
  generateStatus,
  getTestTransactionsPool,
  makeTestTransaction,
  TransactionItem,
} from '../helpModals/getTestTransactions';
import { closeHelpModal } from './uiSelectors';

export type AppModeType = 'default' | 'dev' | 'expert';

export interface IUISlice {
  isGaslessVote: boolean;
  checkIsGaslessVote: () => void;
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

  helpProposalData: ProposalWithLoadings | undefined;
  getHelpProposalData: () => void;
  setHelpProposalData: (proposalData: ProposalWithLoadings | undefined) => void;

  helpDelegateData: DelegateItem[];
  setHelpDelegateData: (delegateData: DelegateItem[]) => void;
  getHelpDelegateData: () => void;

  testTransactionsPool: Record<number, TransactionItem>;
  getTestTransactionsPool: () => void;
  addTestTransaction: (timestamp: number) => void;
  resetTestTransactionsPool: () => void;

  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;

  isProposalHistoryModalOpen: boolean;
  setIsProposalHistoryOpen: (value: boolean) => void;

  isVotersModalOpen: boolean;
  setIsVotersModalOpen: (value: boolean) => void;

  connectWalletModalOpen: boolean;
  setConnectWalletModalOpen: (value: boolean) => void;

  accountInfoModalOpen: boolean;
  setAccountInfoModalOpen: (value: boolean) => void;

  allTransactionModalOpen: boolean;
  setAllTransactionModalOpen: (value: boolean) => void;

  isCreatePayloadModalOpen: boolean;
  setIsCreatePayloadModalOpen: (value: boolean) => void;

  isCreateProposalModalOpen: boolean;
  setIsCreateProposalModalOpen: (value: boolean) => void;

  isActivateVotingModalOpen: boolean;
  setIsActivateVotingModalOpen: (value: boolean) => void;

  isSendAAVEProofModalOpen: boolean;
  setIsSendAAVEProofModalOpen: (value: boolean) => void;

  isSendAAAVEProofModalOpen: boolean;
  setIsSendAAAVEProofModalOpen: (value: boolean) => void;

  isSendAAAVESlotModalOpen: boolean;
  setIsSendAAAVESlotModalOpen: (value: boolean) => void;

  isSendSTKAAVEProofModalOpen: boolean;
  setIsSendSTKAAVEProofModalOpen: (value: boolean) => void;

  isSendSTKAAVESlotModalOpen: boolean;
  setIsSendSTKAAVESlotModalOpen: (value: boolean) => void;

  isSendRepresentationsProofModalOpen: boolean;
  setIsSendRepresentationsProofModalOpen: (value: boolean) => void;

  isActivateVotingOnVotingMachineModalOpen: boolean;
  setIsActivateVotingOnVotingMachineModalOpen: (value: boolean) => void;

  isVoteModalOpen: boolean;
  setIsVoteModalOpen: (value: boolean) => void;

  isDelegateModalOpen: boolean;
  setDelegateModalOpen: (value: boolean) => void;

  isDelegateChangedView: boolean;
  setIsDelegateChangedView: (value: boolean) => void;

  isCloseVotingModalOpen: boolean;
  setCloseVotingModalOpen: (value: boolean) => void;

  isExecuteProposalModalOpen: boolean;
  setExecuteProposalModalOpen: (value: boolean) => void;

  isExecutePayloadModalOpen: boolean;
  setExecutePayloadModalOpen: (value: boolean) => void;

  isCancelProposalModalOpen: boolean;
  setIsCancelProposalModalOpen: (value: boolean) => void;

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

  isRepresentationsModalOpen: boolean;
  setRepresentationsModalOpen: (value: boolean) => void;

  isRepresentationsChangedView: boolean;
  setIsRepresentationsChangedView: (value: boolean) => void;

  isTermModalOpen: boolean;
  setIsTermModalOpen: (value: boolean) => void;

  isRepresentationInfoModalOpen: boolean;
  setIsRepresentationInfoModalOpen: (value: boolean) => void;
}

export const createUISlice: StoreSlice<
  IUISlice,
  IWalletSlice & TransactionsSlice
> = (set, get) => ({
  isGaslessVote: true,
  checkIsGaslessVote: () => {
    if (
      localStorage?.getItem('isGaslessVote') === 'on' &&
      get().isGelatoAvailable &&
      !get().activeWallet?.isContractAddress
    ) {
      set({ isGaslessVote: true });
    } else {
      set({ isGaslessVote: false });
    }
  },
  setIsGaslessVote: (value) => {
    localStorage?.setItem('isGaslessVote', value ? 'on' : 'off');
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
      localStorage?.getItem('termsAccept') !== 'true' &&
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
      localStorage?.setItem('termsAccept', 'true');
      set({ isAppBlockedByTerms: false });
    }
  },

  appMode: 'default',
  checkAppMode: () => {
    if (get().activeWallet?.isContractAddress) {
      localStorage?.setItem('appMode', 'default');
      set({ appMode: 'default' });
    } else {
      const localStorageAppMode = localStorage?.getItem(
        'appMode',
      ) as AppModeType;

      if (localStorageAppMode) {
        set({ appMode: localStorageAppMode });
      } else {
        localStorage?.setItem('appMode', 'default');
        set({ appMode: 'default' });
      }
    }
  },
  setAppMode: (appMode) => {
    if (get().activeWallet?.isContractAddress) {
      localStorage?.setItem('appMode', 'default');
      set({ appMode: 'default' });
    } else {
      localStorage?.setItem('appMode', appMode);
      set({ appMode });
    }
  },

  helpProposalData: undefined,
  getHelpProposalData: () => {
    const proposalData = getProposalData();

    set((state) =>
      produce(state, (draft) => {
        draft.helpProposalData = {
          ...proposalData,
          proposal: {
            ...proposalData.proposal,
            data: {
              ...proposalData.proposal.data,
              votingMachineData: {
                ...proposalData.proposal.data.votingMachineData,
                forVotes:
                  draft.helpProposalData?.proposal.data.votingMachineData
                    .forVotes === '0'
                    ? '0'
                    : draft.helpProposalData?.proposal.data.votingMachineData
                        .forVotes || '0',
                againstVotes:
                  draft.helpProposalData?.proposal.data.votingMachineData
                    .againstVotes === '0'
                    ? '0'
                    : draft.helpProposalData?.proposal.data.votingMachineData
                        .againstVotes || '0',
                votedInfo: {
                  ...proposalData.proposal.data.votingMachineData.votedInfo,
                  support:
                    draft.helpProposalData?.proposal.data.votingMachineData
                      .votedInfo.support || false,
                  votingPower:
                    draft.helpProposalData?.proposal.data.votingMachineData
                      .votedInfo.votingPower || '0',
                },
              },
            },
          },
        };
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

  isModalOpen: false,
  setModalOpen: (value) => {
    set({ isModalOpen: value });
  },

  isProposalHistoryModalOpen: false,
  setIsProposalHistoryOpen: (value) => {
    set({ isModalOpen: value, isProposalHistoryModalOpen: value });
  },

  isVotersModalOpen: false,
  setIsVotersModalOpen: (value) => {
    set({ isModalOpen: value, isVotersModalOpen: value });
  },

  connectWalletModalOpen: false,
  setConnectWalletModalOpen(value) {
    set({ isModalOpen: value, connectWalletModalOpen: value });
  },

  isCreatePayloadModalOpen: false,
  setIsCreatePayloadModalOpen: (value) => {
    set({ isModalOpen: value, isCreatePayloadModalOpen: value });
  },

  isCreateProposalModalOpen: false,
  setIsCreateProposalModalOpen: (value) => {
    set({ isModalOpen: value, isCreateProposalModalOpen: value });
  },

  accountInfoModalOpen: false,
  setAccountInfoModalOpen: (value) => {
    set({ isModalOpen: value, accountInfoModalOpen: value });
  },

  allTransactionModalOpen: false,
  setAllTransactionModalOpen: (value) => {
    set({ isModalOpen: value, allTransactionModalOpen: value });
  },

  isActivateVotingModalOpen: false,
  setIsActivateVotingModalOpen: (value) => {
    set({ isModalOpen: value, isActivateVotingModalOpen: value });
  },

  isSendAAVEProofModalOpen: false,
  setIsSendAAVEProofModalOpen: (value) => {
    set({ isModalOpen: value, isSendAAVEProofModalOpen: value });
  },

  isSendAAAVEProofModalOpen: false,
  setIsSendAAAVEProofModalOpen: (value) => {
    set({ isModalOpen: value, isSendAAAVEProofModalOpen: value });
  },

  isSendAAAVESlotModalOpen: false,
  setIsSendAAAVESlotModalOpen: (value) => {
    set({ isModalOpen: value, isSendAAAVESlotModalOpen: value });
  },

  isSendSTKAAVEProofModalOpen: false,
  setIsSendSTKAAVEProofModalOpen: (value) => {
    set({ isModalOpen: value, isSendSTKAAVEProofModalOpen: value });
  },

  isSendSTKAAVESlotModalOpen: false,
  setIsSendSTKAAVESlotModalOpen: (value) => {
    set({ isModalOpen: value, isSendSTKAAVESlotModalOpen: value });
  },

  isSendRepresentationsProofModalOpen: false,
  setIsSendRepresentationsProofModalOpen: (value) => {
    set({ isModalOpen: value, isSendRepresentationsProofModalOpen: value });
  },

  isActivateVotingOnVotingMachineModalOpen: false,
  setIsActivateVotingOnVotingMachineModalOpen: (value) => {
    set({
      isModalOpen: value,
      isActivateVotingOnVotingMachineModalOpen: value,
    });
  },

  isVoteModalOpen: false,
  setIsVoteModalOpen: (value) => {
    set({ isModalOpen: value, isVoteModalOpen: value });
  },

  isDelegateModalOpen: false,
  setDelegateModalOpen: (value) => {
    set({ isModalOpen: value, isDelegateModalOpen: value });
  },

  isDelegateChangedView: false,
  setIsDelegateChangedView: (value) => {
    set({ isDelegateChangedView: value });
  },

  isCloseVotingModalOpen: false,
  setCloseVotingModalOpen: (value) => {
    set({ isModalOpen: value, isCloseVotingModalOpen: value });
  },

  isExecuteProposalModalOpen: false,
  setExecuteProposalModalOpen: (value) => {
    set({ isModalOpen: value, isExecuteProposalModalOpen: value });
  },

  isExecutePayloadModalOpen: false,
  setExecutePayloadModalOpen: (value) => {
    set({ isModalOpen: value, isExecutePayloadModalOpen: value });
  },

  isCancelProposalModalOpen: false,
  setIsCancelProposalModalOpen: (value) => {
    set({ isModalOpen: value, isCancelProposalModalOpen: value });
  },

  isClickedOnStartButtonOnHelpModal: false,
  checkTutorialStartButtonClick: () => {
    const localStorageTutorialStartButtonClick = localStorage?.getItem(
      'tutorialStartButtonClicked',
    );

    if (localStorageTutorialStartButtonClick) {
      set({
        isClickedOnStartButtonOnHelpModal:
          localStorageTutorialStartButtonClick === 'true',
      });
    } else {
      localStorage?.setItem('tutorialStartButtonClicked', 'false');
      set({ isClickedOnStartButtonOnHelpModal: false });
    }
  },
  setIsClickedOnStartButtonOnHelpModal: (value) => {
    localStorage?.setItem('tutorialStartButtonClicked', `${value}`);
    set({ isClickedOnStartButtonOnHelpModal: value });
  },

  isHelpModalClosed: false,
  setIsHelpModalClosed: (value) => {
    set({ isHelpModalClosed: value });
  },

  isHelpModalOpen: false,
  setIsHelpModalOpen: (value) => {
    set({ isModalOpen: value, isHelpModalOpen: value });
    if (!get().isHelpModalOpen) {
      closeHelpModal(get());
    }
  },

  isHelpNavigationModalOpen: false,
  setIsHelpNavigationModalOpen: (value) => {
    set({
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
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
      isModalOpen: value,
      isHelpDelegationPropositionPowerModalOpen: value,
      isHelpModalOpen: false,
      isHelpNavigationModalOpen: false,
    });
    if (!get().isHelpDelegationPropositionPowerModalOpen) {
      closeHelpModal(get());
    }
  },

  isRepresentationsModalOpen: false,
  setRepresentationsModalOpen: (value) => {
    set({ isModalOpen: value, isRepresentationsModalOpen: value });
  },

  isRepresentationsChangedView: false,
  setIsRepresentationsChangedView: (value) => {
    set({ isRepresentationsChangedView: value });
  },

  isTermModalOpen: false,
  setIsTermModalOpen: (value) => {
    set({ isModalOpen: value, isTermModalOpen: value });
  },

  isRepresentationInfoModalOpen: false,
  setIsRepresentationInfoModalOpen: (value) => {
    set({ isModalOpen: value, isRepresentationInfoModalOpen: value });
  },
});
