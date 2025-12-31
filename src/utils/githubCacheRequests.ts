// This file is kept for backwards compatibility
// All new code should use the TanStack Query hooks from src/queries/proposalQueries.ts

import {
  CachedDetails,
  FinishedProposalForList,
  ProposalHistoryItem,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers';

import {
  cachedDetailsPath,
  cachedEventsPath,
  cachedProposalsIdsPath,
  cachedVotesPath,
  githubStartUrl,
  listViewPath,
} from './cacheGithubLinks';

// Generic fetcher for GitHub cache
async function fetchFromGithubCache<T>(path: string): Promise<T> {
  const response = await fetch(`${githubStartUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

// Legacy functions - prefer using TanStack Query hooks instead
export const getProposalListCacheFromGithub = () =>
  fetchFromGithubCache<{
    totalProposalCount: number;
    proposals: FinishedProposalForList[];
  }>(listViewPath);

export const getCachedProposalsIdsFromGithub = () =>
  fetchFromGithubCache<{
    cachedProposalsIds: number[];
  }>(cachedProposalsIdsPath);

export const getProposalDetailsCache = (id: number) =>
  fetchFromGithubCache<CachedDetails>(cachedDetailsPath(id));

export const getProposalVotesCache = (id: number) =>
  fetchFromGithubCache<{ votes: VotersData[] }>(cachedVotesPath(id));

export const getProposalEventsCache = (id: number) =>
  fetchFromGithubCache<Record<string, ProposalHistoryItem>>(
    cachedEventsPath(id),
  );
