import { Client } from 'viem';

import { ContractsConstants, VotingConfig } from '../types';
import { getDataForList } from './utils/getDataForList';
import { getPayloadsDataRPC } from './utils/getPayloadsDataRPC';
import { getProposalMetadata } from './utils/getProposalMetadata';
import { getProposalsDataRPC } from './utils/getProposalsDataRPC';

export type FetchProposalsDataForListParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> & {
  votingConfigs: VotingConfig[];
  userAddress?: string;
  representativeAddress?: string;
  clients: Record<number, Client>;
  activeIds: number[];
};

export async function fetchActiveProposalsDataForList({
  input,
}: {
  input: FetchProposalsDataForListParams;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposals data from API, using RPC fallback',
      e,
    );
    const proposalsData = await Promise.all(
      (await getProposalsDataRPC({ ...input, proposalsIds: input.activeIds }))
        .sort((a, b) => b.id - a.id)
        .map(async (proposal) => {
          return {
            ...proposal,
            title: (await getProposalMetadata({ hash: proposal.ipfsHash }))
              .title,
          };
        }),
    );
    return await getDataForList({
      input,
      proposals: proposalsData,
      getPayloadsData: ({ ...props }) => getPayloadsDataRPC({ ...props }),
    });
  }
}
