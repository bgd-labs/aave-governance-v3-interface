import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL, PAGE_SIZE } from '../configs/configs';
import {
  ContractsConstants,
  GetGovernanceProposalsResponse,
  ProposalStateForFilters,
  VotingConfig,
} from '../types';
import { formatListData } from './utils/formatDataFromAPI';

export type FetchFilteredDataForListParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> & {
  votingConfigs: VotingConfig[];
  activePage?: number;
  title?: string | null;
  state?: ProposalStateForFilters | null;
};

export async function fetchFilteredDataForList({
  input,
}: {
  input: FetchFilteredDataForListParams;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const urlGen = (state?: number | null) =>
        `${INITIAL_API_URL}/proposals/get/?pageSize=${PAGE_SIZE}&page=${input.activePage}${input.title ? `&title=${input.title}` : ''}${state ? `&proposalState=${state}` : ''}`;

      if (input.state === ProposalStateForFilters.Active) {
        const data = await Promise.all([
          (await (
            await fetch(urlGen(ProposalStateForFilters.Created))
          ).json()) as GetGovernanceProposalsResponse,
          (await (
            await fetch(urlGen(ProposalStateForFilters.Succeed))
          ).json()) as GetGovernanceProposalsResponse,
          (await (
            await fetch(urlGen(ProposalStateForFilters.Voting))
          ).json()) as GetGovernanceProposalsResponse,
        ]);

        const proposals = [
          ...(data[0]?.proposals ?? []),
          ...(data[1]?.proposals ?? []),
          ...(data[2]?.proposals ?? []),
        ];

        const count = Math.max(
          ...[
            data[0].totalProposalsCount[0].count ?? 0,
            data[1].totalProposalsCount[0].count ?? 0,
            data[2].totalProposalsCount[0].count ?? 0,
          ],
        );

        return {
          data: await formatListData(input, { proposals }),
          count,
        };
      } else if (input.state === ProposalStateForFilters.Failed) {
        const data = await Promise.all([
          (await (
            await fetch(urlGen(ProposalStateForFilters.Failed))
          ).json()) as GetGovernanceProposalsResponse,
          (await (
            await fetch(urlGen(ProposalStateForFilters.Expired))
          ).json()) as GetGovernanceProposalsResponse,
        ]);

        const proposals = [
          ...(data[0]?.proposals ?? []),
          ...(data[1]?.proposals ?? []),
        ];

        const count = Math.max(
          ...[
            data[0].totalProposalsCount[0].count ?? 0,
            data[1].totalProposalsCount[0].count ?? 0,
          ],
        );

        return {
          data: await formatListData(input, { proposals }),
          count,
        };
      } else {
        const data = (await (
          await fetch(urlGen(input.state))
        ).json()) as GetGovernanceProposalsResponse;
        return {
          data: await formatListData(input, data),
          count: data.totalProposalsCount[0].count,
        };
      }
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error('Error getting filtered proposals data for list from API', e);
  }
}
