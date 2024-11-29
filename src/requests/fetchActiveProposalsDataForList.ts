import { getProposalMetadata } from '@bgd-labs/js-utils';
import { Client } from 'viem';

import { ipfsGateway } from '../configs/configs';
import { texts } from '../old/ui/utils/texts';
import { ContractsConstants, VotingConfig } from '../types';
import { getDataForList } from './utils/getDataForList';
import { getPayloadsDataRPC } from './utils/getPayloadsDataRPC';
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
      'Error getting active proposals data for list from API, using RPC fallback',
      e,
    );
    const proposalsData = await Promise.all(
      (await getProposalsDataRPC({ ...input, proposalsIds: input.activeIds }))
        .sort((a, b) => b.id - a.id)
        .map(async (proposal) => {
          let title = `Proposal ${proposal.id}`;
          let ipfsError = '';

          try {
            const proposalMetadata = await getProposalMetadata(
              proposal.ipfsHash,
              ipfsGateway,
            );
            title = proposalMetadata.title;
          } catch (e) {
            ipfsError = texts.other.fetchFromIpfsError;
            console.error('Error getting ipfs data', e);
          }

          return {
            ...proposal,
            title,
            ipfsError,
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
