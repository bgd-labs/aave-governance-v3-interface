import { Client } from 'viem';

import { ContractsConstants, GetProposalsData, VotingConfig } from '../types';
import { getDataForList } from './utils/getDataForList';
import { getPayloadsDataRPC } from './utils/getPayloadsDataRPC';
import { getProposalsDataRPC } from './utils/getProposalsDataRPC';

export type FetchProposalsDataForListParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> &
  GetProposalsData & {
    votingConfigs: VotingConfig[];
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
    const proposalsData = (await getProposalsDataRPC(input))
      .sort((a, b) => b.id - a.id)
      .map((proposal) => {
        return {
          ...proposal,
          title: `Proposal ${proposal.id}`,
        };
      });
    return await getDataForList({
      input,
      proposals: proposalsData,
      getPayloadsData: ({ ...props }) => getPayloadsDataRPC({ ...props }),
    });
  }
}
