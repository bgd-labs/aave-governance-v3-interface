import { coreName } from './appConfig';

export const githubInitialUrl =
  process.env.NEXT_PUBLIC_CACHE_URL ||
  'https://raw.githubusercontent.com/aave-dao/aave-governance-cache/main/cache';
export const githubStartUrl = `${githubInitialUrl}/ui/${coreName}`;

export const listViewPath = '/list_view_proposals.json';
export const cachedProposalsIdsPath = '/cached_proposals_ids.json';
export const cachedCreationFeesPath = '/creation_fees.json';
export const cachedProposalsPayloadsPath = '/proposals_payloads.json';

export const cachedDetailsPath = (id: number) =>
  `/proposals/proposal_${id}.json`;

export const cachedVotesPath = (id: number) =>
  `/votes/vote_for_proposal_${id}.json`;

export const cachedEventsPath = (id: number) =>
  `/events/proposal_${id}_events.json`;

export const cachedIPFSDataPath = (ipfsHash: string) =>
  `/ipfs/${ipfsHash}.json`;
