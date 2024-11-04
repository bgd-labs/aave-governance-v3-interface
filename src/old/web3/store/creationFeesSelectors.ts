import { Address } from 'viem';

import { ICreationFeesSlice } from './creationFeesSlice';

export const selectCreationFeesDataByCreator = (
  store: ICreationFeesSlice,
  creator: Address,
) => {
  const creationFeesData = store.creationFeesData;
  return creationFeesData[creator] || {};
};
