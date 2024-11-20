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
    const fillteredActiveProposalsData =
      store.proposalsListData.activeProposalsData.filter((proposal) =>
        ids.includes(proposal.proposalId),
      );
    const fillteredFinishedProposalsData =
      store.proposalsListData.finishedProposalsData.filter((proposal) =>
        ids.includes(proposal.proposalId),
      );

    return {
      activeProposalsData: fillteredActiveProposalsData,
      finishedProposalsData: fillteredFinishedProposalsData,
    };
  } else {
    return {
      activeProposalsData: [],
      finishedProposalsData: [],
    };
  }
};
