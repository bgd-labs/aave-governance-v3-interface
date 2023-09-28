import {
  CachedDetails,
  FinishedProposalForList,
  VotersData,
} from 'aave-governance-ui-helpers';
import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';
import ReactHook from 'alova/react';

import {
  cachedDetailsPath,
  cachedProposalsIdsPath,
  cachedVotesPath,
  githubStartUrl,
  listViewPath,
} from './cacheGithubLinks';

const alovaInstance = createAlova({
  baseURL: githubStartUrl,
  statesHook: ReactHook,
  requestAdapter: GlobalFetch(),
  responded: {
    onSuccess: async (response) => {
      const data = await response.json();
      return !!data ? data : undefined;
    },
  },
});

export const getProposalListCacheFromGithub = alovaInstance.Get<{
  totalProposalCount: number;
  proposals: FinishedProposalForList[];
}>(listViewPath);

export const getCachedProposalsIdsFromGithub = alovaInstance.Get<{
  cachedProposalsIds: number[];
}>(cachedProposalsIdsPath);

export const getProposalDetailsCache = (id: number) =>
  alovaInstance.Get<CachedDetails>(cachedDetailsPath(id));

export const getProposalVotesCache = (id: number) =>
  alovaInstance.Get<{ votes: VotersData[] }>(cachedVotesPath(id));
