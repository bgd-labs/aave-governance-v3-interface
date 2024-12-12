import Fuse from 'fuse.js';
import { Hex } from 'viem';

import {
  ProposalState,
  ProposalStateForFilters,
  VotersData,
} from '../../types';
import { IProposalSlice } from '../proposalSlice';
import {
  IProposalsListSlice,
  selectIdsForRequest,
} from '../proposalsListSlice';
import { IProposalsSlice } from '../proposalsSlice';

export const selectFilteredIds = (
  store: IProposalsSlice & IProposalsListSlice,
) => {
  const proposals = store.proposalsListData;

  const activeFormattedProposals = Object.values(
    proposals.activeProposalsData,
  ).map((proposal) => {
    return {
      id: proposal.proposalId,
      state: proposal.state.state,
      title: proposal.title,
    };
  });

  const finishedFormattedData = Object.values(
    proposals.finishedProposalsData,
  ).map((proposal) => {
    return {
      id: proposal.proposalId,
      state: proposal.state.state,
      title: proposal.title,
    };
  });

  const totalData = [...activeFormattedProposals, ...finishedFormattedData];

  const fuse = new Fuse(totalData, {
    keys: ['title'],
    threshold: 0.3,
    distance: 1000,
  });

  const withoutTitle =
    store.filters.title === null || store.filters.title === '';

  return store.filters.state !== null && withoutTitle
    ? totalData
        .filter((proposal) =>
          store.filters.state !== ProposalStateForFilters.Active
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              proposal?.state === store.filters.state
            : proposal?.state === ProposalState.Created ||
              proposal?.state === ProposalState.Voting ||
              proposal?.state === ProposalState.Succeed,
        )
        .map((proposal) => proposal?.id || 0)
    : store.filters.state === null && store.filters.title !== null
      ? fuse.search(store.filters.title || '').map((item) => item.item?.id || 0)
      : fuse
          .search(store.filters.title || '')
          .filter((item) =>
            store.filters.state !== ProposalStateForFilters.Active
              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                item.item?.state === store.filters.state
              : item.item?.state === ProposalState.Created ||
                item.item?.state === ProposalState.Voting ||
                item.item?.state === ProposalState.Succeed,
          )
          .map((item) => item.item?.id || 0);
};

export const selectProposalsForActivePage = (
  store: IProposalsSlice & IProposalsListSlice,
  activePage: number,
) => {
  if (store.totalProposalsCount !== -1) {
    const filteredIds = selectFilteredIds(store);
    const idsByPage = selectIdsForRequest(
      filteredIds.sort((a, b) => b - a),
      store.filters.activePage ?? 1,
    );
    const ids =
      (store.filters.title !== null && store.filters.title !== '') ||
      store.filters.state !== null
        ? idsByPage
        : selectIdsForRequest(
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
