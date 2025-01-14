import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL, PAGE_SIZE } from '../configs/configs';
import { GetGovernanceProposalsResponse } from '../server/api/types';
import { selectIdsForRequest } from '../store/selectors/proposalsSelector';
import { ContractsConstants, VotingConfig } from '../types';
import { formatListData } from './utils/formatDataFromAPI';
import {
  getDataForList,
  getProposalsWithPayloads,
} from './utils/getDataForList';
import { getProposalPayloadsDataRPC } from './utils/getProposalPayloadsDataRPC';
import {
  GetProposalsData,
  getProposalsDataRPC,
} from './utils/getProposalsDataRPC';
import { getVotingProposalsDataRPC } from './utils/getVotingProposalsDataRPC';

export type FetchProposalsDataForListParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> &
  GetProposalsData & {
    votingConfigs: VotingConfig[];
    activePage?: number;
  };

export async function fetchProposalsDataForList({
  input,
}: {
  input: FetchProposalsDataForListParams;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const url = `${INITIAL_API_URL}/proposals/get/?pageSize=${PAGE_SIZE}&page=${input.activePage}`;
      const dataRaw = await fetch(url);
      const data = (await dataRaw.json()) as GetGovernanceProposalsResponse;
      return await formatListData(input, data);
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error(
      'Error getting proposals data for list from API, using RPC fallback',
      e,
    );
    const proposalsIds =
      input.activePage && input.proposalsCount
        ? selectIdsForRequest(
            [...Array(Number(input.proposalsCount)).keys()].sort(
              (a, b) => b - a,
            ),
            input.activePage,
          )
        : input.proposalsIds;

    const proposalsData = (
      await getProposalsDataRPC({ ...input, proposalsIds })
    ).sort((a, b) => b.id - a.id);

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
