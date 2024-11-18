import React from 'react';

import { PAGE_SIZE } from '../../configs/configs';
import { api } from '../../trpc/server';
import { Container } from '../primitives/Container';
import { ActiveItem } from './ActiveItem';
import { FinishedItem } from './FinishedItem';
import { NoData } from './NoData';
import { NoFilteredData } from './NoFilteredData';
import { ProposalsPagination } from './ProposalsPagination';

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

  if (count === 0n) {
    return (
      <Container>
        <NoData />
      </Container>
    );
  }

  const proposalsData = await api.proposalsList.getAll({
    ...configs.contractsConstants,
    votingConfigs: configs.configs,
    proposalsIds: selectIdsForRequest(
      [...Array(Number(count)).keys()].sort((a, b) => b - a),
      activePage,
    ),
  });

  if (
    ![
      ...proposalsData.activeProposalsData,
      ...proposalsData.finishedProposalsData,
    ].length &&
    (searchParams.filteredState !== null ||
      searchParams.titleSearchValue !== undefined)
  ) {
    return (
      <Container>
        <NoFilteredData />
      </Container>
    );
  }

  return (
    <Container>
      {proposalsData.activeProposalsData.map((proposal) => {
        return <ActiveItem proposalData={proposal} key={proposal.proposalId} />;
      })}
      {proposalsData.finishedProposalsData.map((proposal) => {
        return <FinishedItem data={proposal} key={proposal.proposalId} />;
      })}
      <ProposalsPagination
        activePage={activePage - 1}
        totalPages={Math.ceil(Number(count) / PAGE_SIZE)}
      />
    </Container>
  );
}
