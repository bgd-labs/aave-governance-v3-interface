import { Hex } from 'viem';

import { VotersData } from '../../types';
import { IProposalSlice } from '../proposalSlice';
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
    votingPower: votingBalances[`${walletAddress}_${snapshotBlockHash}`]
      ? votingBalances[`${walletAddress}_${snapshotBlockHash}`]
          .map((power) => power.votingPower)
          .reduce((acc, num) => acc + num, 0n)
      : 0n,
  };
};

export const selectProposalDetailedData = ({
  proposalDetails,
  id,
}: { id: number } & Pick<IProposalSlice, 'proposalDetails'>) => {
  return proposalDetails[id];
};

export const selectVotersByProposalId = (
  voters: Record<Hex, VotersData>,
  id: number,
) => {
  const votersLocal = Object.values(voters).filter(
    (voter) => voter.proposalId === id,
  );
  const lastBlockNumber = Math.max.apply(
    0,
    votersLocal.map((vote) => vote.blockNumber),
  );

  return {
    votersLocal,
    lastBlockNumber,
  };
};
