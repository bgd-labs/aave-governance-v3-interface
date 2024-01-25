import { coreName } from './appConfig';

export const githubStartUrl = `https://raw.githubusercontent.com/bgd-labs/aave-governance-ui-helpers/main/cache/ui/${coreName}`;

export const listViewPath = '/list_view_proposals.json';
export const cachedProposalsIdsPath = '/cached_proposals_ids.json';
export const cachedDetailsPath = (id: number) =>
  `/proposals/proposal_${id}.json`;

export const cachedVotesPath = (id: number) =>
  `/votes/vote_for_proposal_${id}.json`;

export const cachedEventsPath = (id: number) =>
  `/events/proposal_${id}_events.json`;
