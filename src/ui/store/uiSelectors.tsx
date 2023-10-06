import { IUISlice } from './uiSlice';

export const selectAllTestTransactions = (state: IUISlice) => {
  return Object.values(state.testTransactionsPool).sort(
    (a, b) => b.localTimestamp - a.localTimestamp,
  );
};

export const closeHelpModal = (state: IUISlice) => {
  state.setIsHelpModalClosed(true);
  setTimeout(() => state.setIsHelpModalClosed(false), 1000);
};
