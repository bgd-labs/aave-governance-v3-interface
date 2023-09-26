import { IUISlice } from './uiSlice';

export const selectAllTestTransactions = (state: IUISlice) => {
  return Object.values(state.testTransactionsPool).sort(
    (a, b) => b.localTimestamp - a.localTimestamp,
  );
};
