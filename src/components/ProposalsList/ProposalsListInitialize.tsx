import { selectIdsForRequest } from '../../store/proposalsSlice';
import { api } from '../../trpc/server';
import { Container } from '../primitives/Container';
import { NoData } from './NoData';
import { NoFilteredData } from './NoFilteredData';
import { ProposalsList } from './ProposalsList';

export async function ProposalsListInitialize({
  activePage,
}: {
  activePage: number;
}) {
  const [configs, count] = await Promise.all([
    await api.configs.get(),
    await api.configs.getProposalsCount(),
  ]);

  if (count === 0n) {
    return (
      <Container>
        <NoData />
      </Container>
    );
  }

  const proposalsListData = await api.proposalsList.getAll({
    ...configs.contractsConstants,
    votingConfigs: configs.configs,
    proposalsIds: selectIdsForRequest(
      [...Array(Number(count)).keys()].sort((a, b) => b - a),
      activePage,
    ),
  });

  if (
    ![
      ...proposalsListData.activeProposalsData,
      ...proposalsListData.finishedProposalsData,
    ].length
  ) {
    return (
      <Container>
        <NoFilteredData />
      </Container>
    );
  }

  return (
    <ProposalsList
      activePage={activePage}
      configs={configs}
      count={Number(count)}
      proposalsData={proposalsListData}
    />
  );
}
