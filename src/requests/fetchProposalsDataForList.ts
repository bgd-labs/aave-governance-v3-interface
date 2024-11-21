import { Client } from 'viem';

import { ContractsConstants, VotingConfig } from '../types';
import { getDataForList } from './utils/getDataForList';
import { getPayloadsData } from './utils/getPayloadsData';
import { GetProposalsData, getProposalsData } from './utils/getProposalsData';

export type FetchProposalsDataForListParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> &
  GetProposalsData & {
    votingConfigs: VotingConfig[];
    userAddress?: string;
    representativeAddress?: string;
    clients: Record<number, Client>;
  };

export async function fetchProposalsDataForList({
  input,
}: {
  input: FetchProposalsDataForListParams;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposals data for list from API, using RPC fallback',
      e,
    );
    const proposalsData = (await getProposalsData(input))
      .sort((a, b) => b.proposal.id - a.proposal.id)
      .map((proposal) => {
        return {
          ...proposal.proposal,
          title: proposal.ipfs?.title,
        };
      });
    return await getDataForList({
      input,
      proposals: proposalsData,
      getPayloadsData: ({ ...props }) => getPayloadsData({ ...props }),
    });
  }
}
