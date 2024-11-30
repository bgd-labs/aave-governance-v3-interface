import {
  IProposalsListSlice,
  selectIdsForRequest,
} from '../proposalsListSlice';
import { IProposalsSlice } from '../proposalsSlice';

export const selectProposalsForActivePage = (
  store: IProposalsSlice & IProposalsListSlice,
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

export const selectProposalDataByUser = ({
  votedData,
  votingBalances,
  walletAddress,
  snapshotBlockHash,
}: {
  walletAddress: string;
  snapshotBlockHash: string;
} & Pick<IProposalsSlice, 'votedData' | 'votingBalances'>) => {
  return {
    voted: votedData[`${walletAddress}_${snapshotBlockHash}`],
    voting: votingBalances[`${walletAddress}_${snapshotBlockHash}`],
  };
};

export const selectVotingBalanceByUser = ({
  votingBalances,
  walletAddress,
  snapshotBlockHash,
}: {
  walletAddress: string;
  snapshotBlockHash: string;
} & Pick<IProposalsSlice, 'votingBalances'>) => {
  return votingBalances[`${walletAddress}_${snapshotBlockHash}`]
    ? votingBalances[`${walletAddress}_${snapshotBlockHash}`]
        .map((power) => power.votingPower)
        .reduce((acc, num) => acc + num, 0n)
    : 0n;
};
