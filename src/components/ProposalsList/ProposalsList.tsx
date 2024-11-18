import { PAGE_SIZE } from '../../configs/configs';
import { api } from '../../trpc/server';
import { ActiveItem } from './ActiveItem';
import { FinishedItem } from './FinishedItem';

export const selectIdsForRequest = (ids: number[], activePage: number) => {
  const startIndex = Number(activePage - 1) * PAGE_SIZE;
  let endIndex = startIndex + PAGE_SIZE;
  if (endIndex > ids.length) {
    endIndex = ids.length;
  }
  return ids.slice(startIndex, endIndex);
};

export async function ProposalsList({
  activePage,
  searchParams,
}: {
  activePage: number;
  searchParams: Record<string, string | undefined>;
}) {
  const [configs, count] = await Promise.all([
    await api.configs.get(),
    await api.configs.getProposalsCount(),
  ]);

  const proposalsData = await api.proposalsList.getAll({
    ...configs.contractsConstants,
    votingConfigs: configs.configs,
    proposalsIds: selectIdsForRequest(
      [...Array(Number(count)).keys()].sort((a, b) => b - a),
      activePage,
    ),
  });

  return (
    <div>
      {proposalsData.activeProposalsData.map((proposal) => {
        return <ActiveItem proposalData={proposal} key={proposal.proposalId} />;
      })}
      {proposalsData.finishedProposalsData.map((proposal) => {
        return <FinishedItem data={proposal} key={proposal.proposalId} />;
      })}
    </div>
  );
}
