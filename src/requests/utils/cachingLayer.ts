import { fallbackProvider } from '@bgd-labs/aave-v3-governance-cache/fallbackProvider';
import { githubPagesProvider } from '@bgd-labs/aave-v3-governance-cache/githubPagesProvider';
import { rpcProvider } from '@bgd-labs/aave-v3-governance-cache/rpcProvider';

export const cachingLayer = fallbackProvider(githubPagesProvider, rpcProvider);
