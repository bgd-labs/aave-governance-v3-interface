import { FinishedProposalForList } from 'aave-governance-ui-helpers';

import { StoreSlice } from '../../../lib/web3/src';

export interface IProposalsListCacheSlice {
  loadingListCache: boolean;
  setLoadingListCache: (value: boolean) => void;

  cachedProposalsIds: number[];
  setCachedProposalsIds: (value: number[]) => void;
  cachedProposals: FinishedProposalForList[];
  setCachedProposals: (value: FinishedProposalForList[]) => void;
}

export const createProposalsListCacheSlice: StoreSlice<
  IProposalsListCacheSlice
> = (set, get) => ({
  loadingListCache: true,
  setLoadingListCache: (value) => set({ loadingListCache: value }),

  cachedProposalsIds: [],
  setCachedProposalsIds: (value) => set({ cachedProposalsIds: value }),
  cachedProposals: [],
  setCachedProposals: (value) => set({ cachedProposals: value }),
});
