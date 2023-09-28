import {
  Balance,
  CachedProposalDataItemWithId,
  getProposalState,
  ProposalWithId,
  ProposalWithLoadings,
  VotersData,
} from '@bgd-labs/aave-governance-ui-helpers';
import Fuse from 'fuse.js';

import { RootState } from '../../store';
import { PAGE_SIZE } from '../../web3/services/govDataService';

export const selectProposalIds = (store: RootState, ids: number[]) => {
  const cachedIdsFromStore = store.cachedProposalsIds;

  const activeIds: number[] = [];
  for (let i = 0; i < ids.length; i++) {
    let found = false;
    for (let j = 0; j < cachedIdsFromStore.length; j++) {
      if (ids[i] === cachedIdsFromStore[j]) {
        found = true;
        break;
      }
    }

    if (!found) {
      activeIds.push(ids[i]);
    }
  }

  const cachedIds: number[] = [];
  for (let i = 0; i < ids.length; i++) {
    let found = false;
    for (let j = 0; j < activeIds.length; j++) {
      if (ids[i] === activeIds[j]) {
        found = true;
        break;
      }
    }

    if (!found) {
      cachedIds.push(ids[i]);
    }
  }

  return { activeIds, cachedIds };
};

export const getCachedProposalDataById = (store: RootState, id: number) => {
  const cachedProposalData = store.cachedProposals.find(
    (proposal) => proposal.id === id,
  );
  if (!!cachedProposalData) {
    return {
      proposal: {
        data: {
          id: cachedProposalData.id,
          finishedTimestamp: cachedProposalData.finishedTimestamp,
          title: cachedProposalData.title,
          ipfsHash: cachedProposalData.ipfsHash,
        },
        state: cachedProposalData.state,
      },
    };
  }
};

export const getProposalDataById = (store: RootState, id: number) => {
  let loading = true;
  let balanceLoading = true;

  const proposalData = store.detailedProposalsData[id];

  if (
    proposalData &&
    !!proposalData.payloads.length &&
    !!store.configs.length &&
    store.contractsConstants.expirationTime > 0
  ) {
    loading = false;

    let balances: Balance[] = [];
    if (!store.representativeLoading) {
      const userAddress =
        store.representative.address || store.activeWallet?.accounts[0];

      if (
        !store.blockHashBalanceLoadings[
          `${proposalData.snapshotBlockHash}_${userAddress}`
        ]
      ) {
        balances =
          typeof store.blockHashBalance[
            `${proposalData.votingMachineData.l1BlockHash}_${userAddress}`
          ] !== 'undefined'
            ? store.blockHashBalance[
                `${proposalData.votingMachineData.l1BlockHash}_${userAddress}`
              ]?.map((balance) => ({ ...balance }))
            : [];
      }
    }

    if (!!balances.length) {
      balanceLoading = false;
    }

    const proposalConfig = selectConfigByAccessLevel(
      store,
      proposalData.accessLevel,
    );

    // minimal delay from all payloads in proposal for payloads execution estimated status timestamp
    const executionPayloadTime = Math.min.apply(
      null,
      proposalData.payloads.map((payload) => payload?.delay || 0),
    );

    const proposalDataWithoutState = {
      data: proposalData,
      precisionDivider: store.contractsConstants.precisionDivider,
      balances: balances || [],
      config: proposalConfig,
      timings: {
        cooldownPeriod: store.contractsConstants.cooldownPeriod,
        expirationTime: store.contractsConstants.expirationTime,
        executionPayloadTime,
      },
    };

    const state = getProposalState({
      proposalData: proposalDataWithoutState.data,
      quorum: proposalDataWithoutState.config.quorum,
      differential: proposalDataWithoutState.config.differential,
      precisionDivider: proposalDataWithoutState.precisionDivider,
      cooldownPeriod: proposalDataWithoutState.timings.cooldownPeriod,
      executionPayloadTime:
        proposalDataWithoutState.timings.executionPayloadTime,
    });

    return {
      loading,
      balanceLoading,
      proposal: {
        ...proposalDataWithoutState,
        state,
      },
    } as ProposalWithLoadings;
  }
};

export const getCombineProposalDataById = (store: RootState, id: number) => {
  const proposalData = store.detailedProposalsData[id];
  const cachedProposalData = store.cachedProposals.find(
    (proposal) => proposal.id === id,
  );

  if (
    proposalData &&
    !!proposalData.payloads.length &&
    !!store.configs.length &&
    store.contractsConstants.expirationTime > 0
  ) {
    return getProposalDataById(store, id);
  } else if (!!cachedProposalData) {
    return getCachedProposalDataById(store, id);
  }
};

export const getProposalTitle = (
  store: RootState,
  id: number,
  ipfsHash: string,
  title?: string,
) => {
  if (title === `Proposal #${id}` && store.ipfsData[ipfsHash]) {
    return store.ipfsData[ipfsHash].title;
  } else if ((title || '') !== `Proposal #${id}` && !store.ipfsData[ipfsHash]) {
    return `Proposal #${id}`;
  } else if (
    title !== store.ipfsData[ipfsHash]?.title &&
    store.ipfsData[ipfsHash]
  ) {
    return store.ipfsData[ipfsHash].title;
  } else if (!!title) {
    return title;
  } else {
    return `Proposal #${id}`;
  }
};

const selectFilteredProposalIds = (store: RootState) => {
  const proposalsIds =
    store.totalProposalCount >= 0
      ? Array.from(Array(store.totalProposalCount).keys()).sort((a, b) => b - a)
      : [];

  const detailedData = proposalsIds.map((id) =>
    getCombineProposalDataById(store, id),
  );

  const fuse = new Fuse(detailedData, {
    keys: ['proposal.data.title'],
    threshold: 0.3,
  });

  return store.filteredState === null && store.titleSearchValue === undefined
    ? proposalsIds
    : store.filteredState !== null && store.titleSearchValue === undefined
    ? detailedData
        .filter((proposal) =>
          store.filteredState !== 7
            ? proposal?.proposal.state === store.filteredState
            : proposal?.proposal.state === 0 ||
              proposal?.proposal.state === 1 ||
              proposal?.proposal.state === 2,
        )
        .map((proposal) => proposal?.proposal.data.id || 0)
    : store.filteredState === null && store.titleSearchValue !== undefined
    ? fuse
        .search(store.titleSearchValue || '')
        .map((item) => item.item?.proposal.data.id || 0)
    : fuse
        .search(store.titleSearchValue || '')
        .filter((item) => item.item?.proposal.state === store.filteredState)
        .map((item) => item.item?.proposal.data.id || 0);
};

export const selectPaginatedIds = (store: RootState) => {
  const ids = selectFilteredProposalIds(store);

  const activePage = store.activePage;
  const startIndex = activePage * PAGE_SIZE;
  let endIndex = startIndex + PAGE_SIZE;

  if (endIndex > ids.length) {
    endIndex = ids.length;
  }

  return ids.slice(startIndex, endIndex);
};

export const selectPaginatedProposalsData = (store: RootState) => {
  const paginatedIds = selectPaginatedIds(store);
  const { activeIds, cachedIds } = selectProposalIds(store, paginatedIds);

  return {
    activeProposals: activeIds.map((id) => {
      return {
        id,
        ...getProposalDataById(store, id),
      } as ProposalWithId;
    }),
    cachedProposals: cachedIds.map((id) => {
      return {
        id,
        ...getCachedProposalDataById(store, id),
      } as CachedProposalDataItemWithId;
    }),
  };
};

export const selectProposalsPages = (store: RootState) => {
  const ids = selectFilteredProposalIds(store);

  const pagesCount = Math.ceil(ids.length / PAGE_SIZE);
  return [...new Array(pagesCount)].map((_, index) => index);
};

export const selectConfigByAccessLevel = (
  store: RootState,
  accessLevel: number,
) => {
  const configs = store.configs;
  return configs.filter((config) => config.accessLevel === accessLevel)[0];
};

export const selectVotersByProposalId = (store: RootState, id: number) => {
  const data = store.voters;
  const voters = data.filter((voter) => voter.proposalId === id);
  const lastBlockNumber = Math.max.apply(
    0,
    voters.map((vote) => vote.blockNumber),
  );

  return {
    voters,
    lastBlockNumber,
  };
};

export const selectIpfsDataByProposalId = (store: RootState, id: number) => {
  const proposalData = store.detailedProposalsData[id];
  if (proposalData) {
    return store.ipfsData[proposalData.ipfsHash];
  }
};

export const selectIpfsDataErrorByProposalId = (
  store: RootState,
  id: number,
) => {
  const proposalData = store.detailedProposalsData[id];
  if (proposalData) {
    return store.ipfsDataErrors[proposalData.ipfsHash];
  }
};

export const selectAvailablePayloadsIdsByChainId = (
  store: RootState,
  payloadsController: string,
) => {
  const proposalsIds =
    store.totalProposalCount >= 0
      ? Array.from(Array(store.totalProposalCount).keys()).sort((a, b) => b - a)
      : [];

  const detailedData = proposalsIds.map((id) => getProposalDataById(store, id));

  const allPayloadsIds = Array.from(
    Array(store.totalPayloadsCount[payloadsController]).keys(),
  ).sort((a, b) => b - a);

  if (!!detailedData.length) {
    const allUsedPayloadsIds = detailedData
      .map(
        (proposal) =>
          proposal &&
          proposal.proposal.data.payloads.filter(
            (payload) => payload.payloadsController === payloadsController,
          ),
      )
      .flat()
      .map((payload) => payload?.id)
      .filter((element, index, self) => self.indexOf(element) === index);

    return allPayloadsIds.filter((id) => allUsedPayloadsIds.indexOf(id) === -1);
  } else {
    return allPayloadsIds;
  }
};

export const setProposalDetailsVoters = (
  store: RootState,
  voters: VotersData[],
) => {
  if (!!voters.length) {
    if (!store.voters.length) {
      store.setVoters(
        [...store.voters, ...voters].filter(
          (value, index, self) =>
            self
              .map((voter) => voter.transactionHash)
              .indexOf(value.transactionHash) === index,
        ),
      );
    } else {
      const newVoters = [...store.voters, ...voters].filter(
        (value, index, self) =>
          self
            .map((voter) => voter.transactionHash)
            .indexOf(value.transactionHash) === index,
      );
      if (
        !!newVoters.filter(
          ({ transactionHash: hash1 }) =>
            !store.voters.some(({ transactionHash: hash2 }) => hash2 === hash1),
        ).length
      ) {
        store.setVoters(newVoters);
      }
    }
  }
};
