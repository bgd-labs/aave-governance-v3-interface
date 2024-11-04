import { FinishedProposalForList } from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';

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
> = (set) => ({
  loadingListCache: true,
  setLoadingListCache: (value) => set({ loadingListCache: value }),

  cachedProposalsIds: [],
  setCachedProposalsIds: (value) => set({ cachedProposalsIds: value }),
  cachedProposals: [],
  setCachedProposals: (value) => set({ cachedProposals: value }),
});
