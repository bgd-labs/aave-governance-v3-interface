import { IProposalsSlice, selectIdsForRequest } from '../proposalsSlice';

export const selectProposalsForActivePage = (
  store: IProposalsSlice,
  activePage: number,
) => {
  if (store.totalProposalsCount !== -1) {
    const ids = selectIdsForRequest(
      [...Array(Number(store.totalProposalsCount)).keys()].sort(
        (a, b) => b - a,
      ),
      activePage,
    );
    const filteredActiveProposalsData = Object.values(
      store.proposalsListData.activeProposalsData,
    ).filter((proposal) => ids.includes(proposal.proposalId));
    const filteredFinishedProposalsData = Object.values(
      store.proposalsListData.finishedProposalsData,
    ).filter((proposal) => ids.includes(proposal.proposalId));

    return {
      activeProposalsData: filteredActiveProposalsData.sort(
        (a, b) => b.proposalId - a.proposalId,
      ),
      finishedProposalsData: filteredFinishedProposalsData.sort(
        (a, b) => b.proposalId - a.proposalId,
      ),
    };
  } else {
    return {
      activeProposalsData: [],
      finishedProposalsData: [],
    };
  }
};
