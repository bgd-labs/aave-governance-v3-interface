import { Hex } from 'viem';

import { PAGE_SIZE } from '../../configs/configs';
import {
  ActiveProposalOnTheList,
  ProposalOnTheList,
  VotersData,
} from '../../types';
import { IProposalSlice } from '../proposalSlice';
import { IProposalsListSlice } from '../proposalsListSlice';
import { IProposalsSlice } from '../proposalsSlice';

export const selectIdsForRequest = (
  ids: number[],
  activePage: number,
  pageSize?: number,
) => {
  const startIndex = Number(activePage - 1) * (pageSize ?? PAGE_SIZE);
  let endIndex = startIndex + (pageSize ?? PAGE_SIZE);
  if (endIndex > ids.length) {
    endIndex = ids.length;
  }
  return ids.slice(startIndex, endIndex);
};

export const selectProposalsForActivePage = ({
  totalProposalsCount,
  proposalsData,
  activePage,
  filters,
}: {
  totalProposalsCount: number;
  proposalsData: {
    activeProposalsData: ActiveProposalOnTheList[];
    finishedProposalsData: ProposalOnTheList[];
  };
  activePage: number;
} & Pick<IProposalsListSlice, 'filters'>) => {
  if (totalProposalsCount !== -1) {
    const ids =
      (filters.title !== null && filters.title !== '') || filters.state !== null
        ? filters.activeIds
        : selectIdsForRequest(
            [...Array(Number(totalProposalsCount)).keys()].sort(
              (a, b) => b - a,
            ),
            activePage,
          );

    const filteredActiveProposalsData =
      proposalsData.activeProposalsData.filter((proposal) =>
        ids.includes(proposal.proposalId),
      );
    const filteredFinishedProposalsData =
      proposalsData.finishedProposalsData.filter((proposal) =>
        ids.includes(proposal.proposalId),
      );

    return {
      activeProposalsData: filteredActiveProposalsData.sort(
        (a, b) => b.proposalId - a.proposalId,
      ),
      finishedProposalsData: filteredFinishedProposalsData.sort(
        (a, b) => b.proposalId - a.proposalId,
      ),
    };
  }

  return {
    activeProposalsData: [],
    finishedProposalsData: [],
  };
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
