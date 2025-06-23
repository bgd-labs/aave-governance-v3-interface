import {
  Balance,
  CachedProposalDataItemWithId,
  ContractsConstants,
  getProposalState,
  ProposalData,
  ProposalMetadata,
  ProposalWithId,
  ProposalWithLoadings,
  VotersData,
  VotingBalance,
  VotingConfig,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Wallet } from '@bgd-labs/frontend-web3-utils';
import Fuse from 'fuse.js';

import { RepresentativeAddress } from '../../representations/store/representationsSlice';
import { RootState } from '../../store';
import { PAGE_SIZE } from '../../web3/services/govDataService';

type GetProposalDataByIdParams = {
  detailedProposalsData: Record<number, ProposalData>;
  configs: VotingConfig[];
  contractsConstants: ContractsConstants;
  representativeLoading: boolean;
  activeWallet: Wallet | undefined;
  representative: RepresentativeAddress;
  blockHashBalanceLoadings: Record<string, boolean>;
  blockHashBalance: VotingBalance;
  proposalId: number;
};

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
  if (cachedProposalData) {
    return {
      proposal: {
        data: {
          id: cachedProposalData.id,
          finishedTimestamp: cachedProposalData.finishedTimestamp,
          title: cachedProposalData.title,
          ipfsHash: cachedProposalData.ipfsHash,
        },
        combineState: cachedProposalData.combineState,
      },
    };
  }
};

export const getProposalDataById = ({
  detailedProposalsData,
  configs,
  contractsConstants,
  representativeLoading,
  activeWallet,
  representative,
  blockHashBalanceLoadings,
  blockHashBalance,
  proposalId,
}: GetProposalDataByIdParams) => {
  let loading = true;
  let balanceLoading = true;

  const proposalData = detailedProposalsData[proposalId];

  if (
    proposalData &&
    !!proposalData.payloads.length &&
    !!configs.length &&
    contractsConstants.expirationTime > 0
  ) {
    loading = false;

    let balances: Balance[] = [];
    if (!representativeLoading) {
      const userAddress = representative.address || activeWallet?.address;

      if (
        !blockHashBalanceLoadings[
          `${proposalData.snapshotBlockHash}_${userAddress}`
        ]
      ) {
        balances =
          typeof blockHashBalance[
            `${proposalData.votingMachineData.l1BlockHash}_${userAddress}`
          ] !== 'undefined'
            ? blockHashBalance[
                `${proposalData.votingMachineData.l1BlockHash}_${userAddress}`
              ]?.map((balance) => ({ ...balance }))
            : [];
      }
    }

    if (balances.length) {
      balanceLoading = false;
    }

    const proposalConfig = selectConfigByAccessLevel(
      configs,
      proposalData.accessLevel,
    );

    // minimal delay from all payloads in proposal for payloads execution estimated status timestamp
    const executionDelay = Math.min.apply(
      null,
      proposalData.payloads.map((payload) => payload?.delay || 0),
    );

    const proposalDataWithoutState = {
      data: proposalData,
      precisionDivider: contractsConstants.precisionDivider,
      balances: balances || [],
      config: proposalConfig,
      timings: {
        cooldownPeriod: contractsConstants.cooldownPeriod,
        expirationTime: contractsConstants.expirationTime,
        executionDelay,
      },
    };

    const combineState = getProposalState({
      proposalData: proposalDataWithoutState.data,
      quorum: proposalDataWithoutState.config.quorum,
      differential: proposalDataWithoutState.config.differential,
      precisionDivider: proposalDataWithoutState.precisionDivider,
      cooldownPeriod: proposalDataWithoutState.timings.cooldownPeriod,
      executionDelay: proposalDataWithoutState.timings.executionDelay,
    });

    return {
      loading,
      balanceLoading,
      proposal: {
        ...proposalDataWithoutState,
        combineState,
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
    return getProposalDataById({
      detailedProposalsData: store.detailedProposalsData,
      configs: store.configs,
      contractsConstants: store.contractsConstants,
      representativeLoading: store.representativeLoading,
      activeWallet: store.activeWallet,
      representative: store.representative,
      blockHashBalanceLoadings: store.blockHashBalanceLoadings,
      blockHashBalance: store.blockHashBalance,
      proposalId: id,
    });
  } else if (cachedProposalData) {
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
  } else if (title) {
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
    distance: 1000,
  });

  return store.filteredState === null && store.titleSearchValue === undefined
    ? proposalsIds
    : store.filteredState !== null && store.titleSearchValue === undefined
      ? detailedData
          .filter((proposal) =>
            store.filteredState !== 7
              ? proposal?.proposal.combineState === store.filteredState
              : proposal?.proposal.combineState === 0 ||
                proposal?.proposal.combineState === 1 ||
                proposal?.proposal.combineState === 2,
          )
          .map((proposal) => proposal?.proposal.data.id || 0)
      : store.filteredState === null && store.titleSearchValue !== undefined
        ? fuse
            .search(store.titleSearchValue || '')
            .map((item) => item.item?.proposal.data.id || 0)
        : fuse
            .search(store.titleSearchValue || '')
            .filter(
              (item) =>
                item.item?.proposal.combineState === store.filteredState,
            )
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
        ...getProposalDataById({
          detailedProposalsData: store.detailedProposalsData,
          configs: store.configs,
          contractsConstants: store.contractsConstants,
          representativeLoading: store.representativeLoading,
          activeWallet: store.activeWallet,
          representative: store.representative,
          blockHashBalanceLoadings: store.blockHashBalanceLoadings,
          blockHashBalance: store.blockHashBalance,
          proposalId: id,
        }),
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
  configs: VotingConfig[],
  accessLevel: number,
) => {
  return configs.filter((config) => config.accessLevel === accessLevel)[0];
};

export const selectVotersByProposalId = (
  voters: Record<string, VotersData>,
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

export const selectIpfsDataByProposalId = (
  detailedProposalsData: Record<number, ProposalData>,
  ipfsData: Record<string, ProposalMetadata>,
  id: number,
) => {
  const proposalData = detailedProposalsData[id];
  if (proposalData) {
    return ipfsData[proposalData.ipfsHash];
  }
};

export const selectIpfsDataErrorByProposalId = (
  detailedProposalsData: Record<number, ProposalData>,
  ipfsDataErrors: Record<string, string>,
  id: number,
) => {
  const proposalData = detailedProposalsData[id];
  if (proposalData) {
    return ipfsDataErrors[proposalData.ipfsHash];
  }
};

export const selectAvailablePayloadsIdsByChainId = ({
  totalProposalCount,
  totalPayloadsCount,
  payloadsController,
  detailedProposalsData,
  configs,
  contractsConstants,
  representativeLoading,
  activeWallet,
  representative,
  blockHashBalanceLoadings,
  blockHashBalance,
}: GetProposalDataByIdParams & {
  totalProposalCount: number;
  totalPayloadsCount: Record<string, number>;
  payloadsController: string;
}) => {
  const proposalsIds =
    totalProposalCount >= 0
      ? Array.from(Array(totalProposalCount).keys()).sort((a, b) => b - a)
      : [];

  const detailedData = proposalsIds.map((id) =>
    getProposalDataById({
      detailedProposalsData,
      configs,
      contractsConstants,
      representativeLoading,
      activeWallet,
      representative,
      blockHashBalanceLoadings,
      blockHashBalance,
      proposalId: id,
    }),
  );

  const allPayloadsIds = Array.from(
    Array(totalPayloadsCount[payloadsController]).keys(),
  ).sort((a, b) => b - a);

  if (detailedData.length) {
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
  setVoters: (voters: VotersData[]) => void,
  voters: VotersData[],
) => {
  if (voters.length) {
    setVoters(voters);
  }
};
