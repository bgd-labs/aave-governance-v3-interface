import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL, PAGE_SIZE } from '../configs/configs';
import { GetGovernanceProposalsResponse } from '../server/api/types';
import {
  ContractsConstants,
  InitialProposalState,
  ProposalState,
  ProposalStateForFilters,
  VotingConfig,
} from '../types';
import { formatListData } from './utils/formatDataFromAPI';

export type FetchFilteredDataForListParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> & {
  votingConfigs: VotingConfig[];
  clients: ClientsRecord;
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
      const urlGen = (state?: InitialProposalState | null) =>
        `${INITIAL_API_URL}/proposals/get/?pageSize=${PAGE_SIZE}&page=${input.activePage}${input.title ? `&title=${input.title}` : ''}${state ? `&proposalState=${state}` : ''}`;

      if (input.state === ProposalStateForFilters.Active) {
        const data = await Promise.all([
          (await (
            await fetch(urlGen(InitialProposalState.Created))
          ).json()) as GetGovernanceProposalsResponse,
          (await (
            await fetch(urlGen(InitialProposalState.Queued))
          ).json()) as GetGovernanceProposalsResponse,
          (await (
            await fetch(urlGen(InitialProposalState.Executed))
          ).json()) as GetGovernanceProposalsResponse,
          (await (
            await fetch(urlGen(InitialProposalState.Active))
          ).json()) as GetGovernanceProposalsResponse,
        ]);

        const proposals = [
          ...(data[0]?.proposals ?? []),
          ...(data[1]?.proposals ?? []),
          ...(data[2]?.proposals ?? []),
          ...(data[3]?.proposals ?? []),
        ];

        const formattedData = await formatListData(input, { proposals });
        const ids = formattedData.activeProposalsData
          .filter(
            (item) =>
              item.state.state === ProposalState.Created ||
              item.state.state === ProposalState.Voting ||
              item.state.state === ProposalState.Succeed,
          )
          .map((proposal) => proposal.proposalId);

        return {
          data: formattedData,
          count: ids.length,
          ids,
        };
      } else if (input.state === ProposalStateForFilters.Failed) {
        const data = await Promise.all([
          (await (
            await fetch(urlGen(InitialProposalState.Failed))
          ).json()) as GetGovernanceProposalsResponse,
          (await (
            await fetch(urlGen(InitialProposalState.Expired))
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

        const formattedData = await formatListData(input, { proposals });

        return {
          data: formattedData,
          count,
          ids: formattedData.finishedProposalsData
            .filter((item) => item.state.state === ProposalState.Failed)
            .map((proposal) => proposal.proposalId),
        };
      } else if (input.state === ProposalStateForFilters.Succeed) {
        const data = await Promise.all([
          (await (
            await fetch(urlGen(InitialProposalState.Queued))
          ).json()) as GetGovernanceProposalsResponse,
          (await (
            await fetch(urlGen(InitialProposalState.Executed))
          ).json()) as GetGovernanceProposalsResponse,
        ]);

        const proposals = [
          ...(data[0]?.proposals ?? []),
          ...(data[1]?.proposals ?? []),
        ];

        const formattedData = await formatListData(input, { proposals });
        const ids = formattedData.activeProposalsData
          .filter((item) => item.state.state === ProposalState.Succeed)
          .map((proposal) => proposal.proposalId);
        return {
          data: formattedData,
          count: ids.length,
          ids,
        };
      } else if (
        input.state ||
        input.state === ProposalStateForFilters.Created
      ) {
        let state = InitialProposalState.Created;
        if (input.state === ProposalStateForFilters.Voting) {
          state = InitialProposalState.Active;
        } else if (input.state === ProposalStateForFilters.Executed) {
          state = InitialProposalState.Executed;
        } else if (input.state === ProposalStateForFilters.Expired) {
          state = InitialProposalState.Expired;
        } else if (input.state === ProposalStateForFilters.Canceled) {
          state = InitialProposalState.Cancelled;
        }

        const data = (await (
          await fetch(urlGen(state))
        ).json()) as GetGovernanceProposalsResponse;

        const formattedData = await formatListData(input, data);

        return {
          data: formattedData,
          count: data.totalProposalsCount[0].count,
          ids: [
            ...formattedData.activeProposalsData,
            ...formattedData.finishedProposalsData,
          ]
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            .filter((item) => item.state.state === input.state)
            .map((proposal) => proposal.proposalId),
        };
      } else {
        const data = (await (
          await fetch(urlGen())
        ).json()) as GetGovernanceProposalsResponse;
        return {
          data: await formatListData(input, data),
          count: data.totalProposalsCount[0].count,
          ids: data.proposals.map((proposal) => proposal.proposalId),
        };
      }
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error('Error getting filtered proposals data for list from API', e);
  }
}
