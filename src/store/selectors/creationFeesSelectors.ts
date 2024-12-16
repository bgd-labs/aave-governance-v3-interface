import { Address } from 'viem';

import { ICreationFeesSlice } from '../creationFeesSlice';

export const selectCreationFeesDataByCreator = ({
  creator,
  creationFeesData,
}: {
  creator: Address;
} & Pick<ICreationFeesSlice, 'creationFeesData'>) => {
  return creationFeesData[creator.toLowerCase() as Address] || {};
};

export const selectCreationFeesDataLoadingByCreator = ({
  creator,
  creationFeesDataLoading,
}: {
  creator: Address;
} & Pick<ICreationFeesSlice, 'creationFeesDataLoading'>) => {
  return typeof creationFeesDataLoading[creator.toLowerCase() as Address] ===
    'undefined'
    ? true
    : creationFeesDataLoading[creator.toLowerCase() as Address];
};
