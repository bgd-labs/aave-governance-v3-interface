# TanStack Query Hooks Usage Guide

This directory contains all TanStack Query hooks for fetching server data. These hooks replace the old Alova-based fetching and provide better caching, deduplication, and developer experience.

## 📚 Available Hooks

### Proposal Queries

All hooks are exported from `proposalQueries.ts`:

```typescript
import {
  useProposalListCache,
  useCachedProposalIds,
  useProposalDetailsCache,
  useProposalVotesCache,
  useProposalEventsCache,
} from '@/queries/proposalQueries';
```

## 🚀 Quick Start Examples

### 1. Fetching Proposal List

```typescript
import { useProposalListCache } from '@/queries/proposalQueries';

function ProposalList() {
  const { data, isLoading, error } = useProposalListCache();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <h2>Total Proposals: {data.totalProposalCount}</h2>
      {data.proposals.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </div>
  );
}
```

### 2. Fetching Individual Proposal Details

```typescript
import { useProposalDetailsCache } from '@/queries/proposalQueries';

function ProposalDetails({ proposalId }: { proposalId: number }) {
  const {
    data: details,
    isLoading,
    error,
  } = useProposalDetailsCache(proposalId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorBoundary error={error} />;

  return (
    <div>
      <h1>{details.ipfs.title}</h1>
      <ProposalContent proposal={details.proposal} />
    </div>
  );
}
```

### 3. Conditional Fetching

Only fetch when you have a valid ID:

```typescript
function ConditionalFetch({ proposalId }: { proposalId?: number }) {
  const { data, isLoading } = useProposalDetailsCache(proposalId ?? -1, {
    enabled: proposalId !== undefined && proposalId >= 0,
  });

  // Won't fetch if proposalId is undefined or < 0
  if (!proposalId) return <SelectProposal />;
  if (isLoading) return <Loading />;

  return <ProposalView data={data} />;
}
```

### 4. Fetching Multiple Resources

```typescript
function ProposalFullView({ proposalId }: { proposalId: number }) {
  const { data: details, isLoading: detailsLoading } =
    useProposalDetailsCache(proposalId);

  const { data: votes, isLoading: votesLoading } =
    useProposalVotesCache(proposalId);

  const { data: events, isLoading: eventsLoading } =
    useProposalEventsCache(proposalId);

  const isLoading = detailsLoading || votesLoading || eventsLoading;

  if (isLoading) return <Loading />;

  return (
    <div>
      <ProposalHeader proposal={details} />
      <VotesSection votes={votes.votes} />
      <HistorySection events={events} />
    </div>
  );
}
```

### 5. Using Query Status for Better UX

```typescript
function SmartProposalView({ proposalId }: { proposalId: number }) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useProposalDetailsCache(proposalId);

  // Show skeleton on initial load
  if (isLoading) return <Skeleton />;

  // Show error with retry button
  if (isError) {
    return (
      <ErrorCard error={error}>
        <Button onClick={() => refetch()}>Retry</Button>
      </ErrorCard>
    );
  }

  return (
    <div>
      {/* Show subtle loading indicator when refetching in background */}
      {isFetching && <RefetchingIndicator />}
      <ProposalContent proposal={data} />
    </div>
  );
}
```

### 6. Custom Options

Override default options for specific use cases:

```typescript
function RealTimeProposal({ proposalId }: { proposalId: number }) {
  const { data } = useProposalDetailsCache(proposalId, {
    staleTime: 30 * 1000, // 30 seconds instead of default 5 minutes
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  return <ProposalView proposal={data} />;
}
```

## 🎯 Best Practices

### ✅ DO

```typescript
// ✅ Use the hook directly in components
function MyComponent() {
  const { data } = useProposalListCache();
  return <div>{data.totalProposalCount}</div>;
}

// ✅ Use conditional fetching with enabled
const { data } = useProposalDetailsCache(id, {
  enabled: id >= 0,
});

// ✅ Handle all states (loading, error, success)
if (isLoading) return <Loading />;
if (error) return <Error />;
return <Success data={data} />;

// ✅ Use TypeScript for type safety
const { data }: { data: CachedDetails } = useProposalDetailsCache(id);
```

### ❌ DON'T

```typescript
// ❌ Don't manually sync to Zustand (TanStack Query handles caching)
useEffect(() => {
  if (data) {
    setProposalsInZustand(data); // Unnecessary!
  }
}, [data]);

// ❌ Don't fetch in useEffect (use the hook instead)
useEffect(() => {
  fetchProposals().then(setData); // Use useProposalListCache() instead
}, []);

// ❌ Don't forget to handle loading and error states
const { data } = useProposalListCache();
return <div>{data.proposals.map(...)}</div>; // Will crash if loading!

// ❌ Don't disable the cache without good reason
const { data } = useProposalListCache({
  gcTime: 0, // Disables caching - usually not needed
});
```

## 🔑 Query Keys

Query keys are used for cache management. They're automatically handled by the hooks:

```typescript
proposalQueryKeys = {
  all: ['proposals'],
  lists: () => ['proposals', 'list'],
  list: () => ['proposals', 'list', 'view'],
  ids: () => ['proposals', 'ids'],
  details: () => ['proposals', 'details'],
  detail: (id) => ['proposals', 'details', id],
  votes: () => ['proposals', 'votes'],
  vote: (id) => ['proposals', 'votes', id],
  events: () => ['proposals', 'events'],
  event: (id) => ['proposals', 'events', id],
};
```

### Invalidating Queries

When data changes (e.g., after voting), invalidate related queries:

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { proposalQueryKeys } from '@/queries/proposalQueries';

function VoteButton({ proposalId }: { proposalId: number }) {
  const queryClient = useQueryClient();

  const handleVote = async () => {
    await submitVote(proposalId);

    // Invalidate this proposal's data
    queryClient.invalidateQueries({
      queryKey: proposalQueryKeys.detail(proposalId),
    });

    // Also invalidate votes
    queryClient.invalidateQueries({
      queryKey: proposalQueryKeys.vote(proposalId),
    });
  };

  return <Button onClick={handleVote}>Vote</Button>;
}
```

## 📊 Debugging

### DevTools

TanStack Query DevTools are enabled in development:

```typescript
// In your app root (already configured in WagmiProvider)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;
```

### Checking Cache Status

```typescript
import { useQueryClient } from '@tanstack/react-query';

function DebugPanel() {
  const queryClient = useQueryClient();

  const showCacheStatus = () => {
    const cache = queryClient.getQueryCache();
    console.log('All queries:', cache.getAll());
  };

  return <Button onClick={showCacheStatus}>Show Cache</Button>;
}
```

## 🔄 Migration from Alova

### Before (Alova)

```typescript
import { useRequest } from 'alova';
import { getProposalListCacheFromGithub } from '@/utils/githubCacheRequests';

function Component() {
  const { loading, data, error } = useRequest(getProposalListCacheFromGithub);

  useEffect(() => {
    if (!loading && !error) {
      // Manual sync to Zustand
      setProposals(data.proposals);
    }
  }, [loading, error]);

  if (loading) return <Loading />;
  return <div>{data.proposals.length}</div>;
}
```

### After (TanStack Query)

```typescript
import { useProposalListCache } from '@/queries/proposalQueries';

function Component() {
  const { isLoading, data, error } = useProposalListCache();

  // No manual sync needed!

  if (isLoading) return <Loading />;
  return <div>{data.proposals.length}</div>;
}
```

## 📖 Advanced Patterns

### Prefetching

Prefetch data before user navigates:

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { proposalQueryKeys } from '@/queries/proposalQueries';

function ProposalListItem({ proposal }: { proposal: Proposal }) {
  const queryClient = useQueryClient();

  const prefetchDetails = () => {
    queryClient.prefetchQuery({
      queryKey: proposalQueryKeys.detail(proposal.id),
      queryFn: () => fetchProposalDetails(proposal.id),
    });
  };

  return (
    <Link
      href={`/proposal/${proposal.id}`}
      onMouseEnter={prefetchDetails} // Prefetch on hover
    >
      {proposal.title}
    </Link>
  );
}
```

### Optimistic Updates

Update UI immediately before server responds:

```typescript
function VoteButton({ proposalId }: { proposalId: number }) {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: submitVote,
    onMutate: async (newVote) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: proposalQueryKeys.detail(proposalId),
      });

      // Snapshot previous value
      const previous = queryClient.getQueryData(
        proposalQueryKeys.detail(proposalId),
      );

      // Optimistically update to new value
      queryClient.setQueryData(proposalQueryKeys.detail(proposalId), (old) => ({
        ...old,
        votes: [...old.votes, newVote],
      }));

      return { previous };
    },
    onError: (err, newVote, context) => {
      // Rollback on error
      queryClient.setQueryData(
        proposalQueryKeys.detail(proposalId),
        context.previous,
      );
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({
        queryKey: proposalQueryKeys.detail(proposalId),
      });
    },
  });

  return <Button onClick={() => voteMutation.mutate({ support: true })}>Vote</Button>;
}
```

## 🆘 Troubleshooting

### Query Won't Fetch

- Check if `enabled` option is `true`
- Verify the ID/parameters are valid
- Check network tab in DevTools

### Stale Data

- Adjust `staleTime` if data updates frequently
- Use `refetchInterval` for polling
- Call `refetch()` manually when needed

### TypeScript Errors

- Import types: `import type { CachedDetails } from '@bgd-labs/aave-governance-ui-helpers'`
- Ensure `queryKey` matches the expected pattern
- Check that data is defined before using: `data?.proposals`

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)
- [Common Mistakes](https://tkdodo.eu/blog/react-query-render-optimizations)
