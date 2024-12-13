import { Client } from 'viem';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL, ipfsGateway } from '../configs/configs';
import { getProposalMetadata } from '../helpers/getProposalMetadata';
import { texts } from '../helpers/texts/texts';
import {
  ContractsConstants,
  GetProposalInitialResponse,
  VotingConfig,
} from '../types';
import { formatListData } from './utils/formatDataFromAPI';
import {
  getDataForList,
  getProposalsWithPayloads,
} from './utils/getDataForList';
import { getProposalPayloadsDataRPC } from './utils/getProposalPayloadsDataRPC';
import { getProposalsDataRPC } from './utils/getProposalsDataRPC';
import { getVotingProposalsDataRPC } from './utils/getVotingProposalsDataRPC';

export type FetchProposalsDataForListParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> & {
  votingConfigs: VotingConfig[];
  clients: Record<number, Client>;
  activeIds: number[];
};

export async function fetchActiveProposalsDataForList({
  input,
}: {
  input: FetchProposalsDataForListParams;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const data = await Promise.all(
        input.activeIds.map(async (id) => {
          const url = `${INITIAL_API_URL}/proposals/${id}/get/`;
          const dataRaw = await fetch(url);
          return (await dataRaw.json()) as GetProposalInitialResponse;
        }),
      );
      return await formatListData(input, {
        proposals: data.filter((proposal) => (proposal.payloads ?? []).length),
      });
    }
    throw new Error('This chain id for gov core not supported by API');
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

    const payloadsData = await getProposalPayloadsDataRPC({
      proposalsData,
      clients: input.clients,
    });

    const data = getProposalsWithPayloads({ proposalsData, payloadsData });

    const voting = await getVotingProposalsDataRPC({
      activeIds: data.activeIds,
      proposalsWithPayloads: data.proposalsWithPayloads,
      clients: input.clients,
    });

    return getDataForList({
      input,
      ...data,
      voting,
    });
  }
}
