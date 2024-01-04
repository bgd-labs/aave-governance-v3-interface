import { RootState } from '../../store';

export const selectCurrentPowers = (store: RootState) => {
  if (!!store.representative.address) {
    return store.currentPowers[store.representative.address];
  } else if (store.activeWallet?.address) {
    return store.currentPowers[store.activeWallet?.address];
  } else {
    return;
  }
};

export const selectCurrentPowersForActiveWallet = (store: RootState) => {
  if (store.activeWallet?.address) {
    return store.currentPowers[store.activeWallet?.address];
  } else {
    return;
  }
};
