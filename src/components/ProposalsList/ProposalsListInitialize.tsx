import { api } from '../../trpc/server';
import { ContractsConstants, VotingConfig } from '../../types';
import { ProposalsList } from './ProposalsList';

export async function ProposalsListInitialize({
  activePage,
  configs,
  count,
}: {
  activePage: number;
  configs: {
    configs: VotingConfig[];
    contractsConstants: ContractsConstants;
  };
  count: bigint;
}) {
  const proposalsListData = await api.proposalsList.getAll({
    ...configs.contractsConstants,
    votingConfigs: configs.configs,
    activePage,
    proposalsCount: Number(count),
  });

  return (
    <ProposalsList
      activePage={activePage}
      configs={configs}
      count={Number(count)}
      proposalsData={proposalsListData}
    />
  );
}
