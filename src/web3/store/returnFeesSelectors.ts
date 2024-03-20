import { Address } from 'viem';

import { IReturnFeesSlice } from './returnFeesSlice';

export const selectReturnsFeesDataByCreator = (
  store: IReturnFeesSlice,
  creator: Address,
) => {
  const returnFeesData = store.returnFeesData;
  return returnFeesData[creator] || {};
};
