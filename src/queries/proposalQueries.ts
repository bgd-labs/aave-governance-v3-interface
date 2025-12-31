import type {
  CachedDetails,
  FinishedProposalForList,
  ProposalHistoryItem,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  cachedDetailsPath,
  cachedEventsPath,
  cachedProposalsIdsPath,
  cachedVotesPath,
  githubStartUrl,
  listViewPath,
} from '../utils/cacheGithubLinks';

// Generic fetcher for GitHub cache
async function fetchFromGithubCache<T>(path: string): Promise<T> {
  const response = await fetch(`${githubStartUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

// Query keys for consistent cache management
export const proposalQueryKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalQueryKeys.all, 'list'] as const,
  list: () => [...proposalQueryKeys.lists(), 'view'] as const,
  ids: () => [...proposalQueryKeys.all, 'ids'] as const,
  details: () => [...proposalQueryKeys.all, 'details'] as const,
  detail: (id: number) => [...proposalQueryKeys.details(), id] as const,
  votes: () => [...proposalQueryKeys.all, 'votes'] as const,
  vote: (id: number) => [...proposalQueryKeys.votes(), id] as const,
  events: () => [...proposalQueryKeys.all, 'events'] as const,
  event: (id: number) => [...proposalQueryKeys.events(), id] as const,
};

// Hook: Get proposal list from GitHub cache
export function useProposalListCache(
  options?: Omit<
    UseQueryOptions<{
      totalProposalCount: number;
      proposals: FinishedProposalForList[];
    }>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: proposalQueryKeys.list(),
    queryFn: () =>
      fetchFromGithubCache<{
        totalProposalCount: number;
        proposals: FinishedProposalForList[];
      }>(listViewPath),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    ...options,
  });
}

// Hook: Get cached proposal IDs
export function useCachedProposalIds(
  options?: Omit<
    UseQueryOptions<{ cachedProposalsIds: number[] }>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: proposalQueryKeys.ids(),
    queryFn: () =>
      fetchFromGithubCache<{ cachedProposalsIds: number[] }>(
        cachedProposalsIdsPath,
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

// Hook: Get proposal details from cache
export function useProposalDetailsCache(
  id: number,
  options?: Omit<UseQueryOptions<CachedDetails>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: proposalQueryKeys.detail(id),
    queryFn: () => fetchFromGithubCache<CachedDetails>(cachedDetailsPath(id)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: id !== undefined && id >= 0,
    ...options,
  });
}

// Hook: Get proposal votes from cache
export function useProposalVotesCache(
  id: number,
  options?: Omit<
    UseQueryOptions<{ votes: VotersData[] }>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: proposalQueryKeys.vote(id),
    queryFn: () =>
      fetchFromGithubCache<{ votes: VotersData[] }>(cachedVotesPath(id)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: id !== undefined && id >= 0,
    ...options,
  });
}

// Hook: Get proposal events from cache
export function useProposalEventsCache(
  id: number,
  options?: Omit<
    UseQueryOptions<Record<string, ProposalHistoryItem>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: proposalQueryKeys.event(id),
    queryFn: () =>
      fetchFromGithubCache<Record<string, ProposalHistoryItem>>(
        cachedEventsPath(id),
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: id !== undefined && id >= 0,
    ...options,
  });
}
