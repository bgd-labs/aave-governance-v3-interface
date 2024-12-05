import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Hex, zeroHash } from 'viem';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { PAGE_SIZE } from '../configs/configs';
import { fetchActiveProposalsDataForList } from '../requests/fetchActiveProposalsDataForList';
import { fetchTotalProposalsCount } from '../requests/fetchTotalProposalsCount';
import { api } from '../trpc/client';
import { ActiveProposalOnTheList, ProposalOnTheList } from '../types';
import { IProposalsSlice } from './proposalsSlice';
import { IRepresentationsSlice } from './representationsSlice';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectProposalDataByUser } from './selectors/proposalsSelector';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { IWeb3Slice } from './web3Slice';

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

export interface IProposalsListSlice {
  proposalsListData: {
    activeProposalsData: Record<number, ActiveProposalOnTheList>;
    finishedProposalsData: Record<number, ProposalOnTheList>;
  };
  initializeProposalsListData: (
    proposalsListData: {
      activeProposalsData: ActiveProposalOnTheList[];
      finishedProposalsData: ProposalOnTheList[];
    },
    fromServer?: boolean,
  ) => void;

  activeProposalsDataInterval: number | undefined;
  startActiveProposalsDataPolling: (activePage?: number) => Promise<void>;
  stopActiveProposalsDataPolling: () => void;

  newProposalsInterval: number | undefined;
  startNewProposalsPolling: () => Promise<void>;
  stopNewProposalsPolling: () => void;

  updateProposalsListActiveData: (
    activeIds: number[],
    activePage?: number,
  ) => Promise<void>;
  updateUserDataOnTheList: () => Promise<void>;

  updatedListDataLoading: Record<number, boolean>;
}

export const createProposalsListSlice: StoreSlice<
  IProposalsListSlice,
  IRpcSwitcherSlice & IProposalsSlice & IWeb3Slice & IRepresentationsSlice
> = (set, get) => ({
  proposalsListData: {
    activeProposalsData: {},
    finishedProposalsData: {},
  },
  initializeProposalsListData: (proposalsListData, fromServer) => {
    proposalsListData.activeProposalsData.forEach((proposal) => {
      set((state) =>
        produce(state, (draft) => {
          if (
            !draft.proposalsListData.activeProposalsData[proposal.proposalId] &&
            fromServer
          ) {
            draft.proposalsListData.activeProposalsData[proposal.proposalId] =
              proposal;
          } else if (!fromServer) {
            draft.proposalsListData.activeProposalsData[proposal.proposalId] = {
              ...proposal,
              isActive: true,
            };
          }
        }),
      );
    });
    proposalsListData.finishedProposalsData.forEach((proposal) => {
      set((state) =>
        produce(state, (draft) => {
          draft.proposalsListData.finishedProposalsData[proposal.proposalId] =
            proposal;
        }),
      );
    });
    proposalsListData.finishedProposalsData.forEach((proposal) => {
      set((state) =>
        produce(state, (draft) => {
          if (
            draft.proposalsListData.finishedProposalsData[proposal.proposalId]
          ) {
            delete draft.proposalsListData.activeProposalsData[
              proposal.proposalId
            ];
          }
        }),
      );
    });
  },

  activeProposalsDataInterval: undefined,
  startActiveProposalsDataPolling: async (activePage) => {
    const currentInterval = get().activeProposalsDataInterval;
    clearInterval(currentInterval);

    const func = async (acP?: number) => {
      const configs = get().configs;
      const activeIds = Object.values(
        get().proposalsListData.activeProposalsData,
      ).map((proposal) => proposal.proposalId);
      if (configs && activeIds.length > 0) {
        await get().updateProposalsListActiveData(activeIds, acP);
      }
    };
    func(activePage);

    const interval = setInterval(func, 30000);
    set({ activeProposalsDataInterval: Number(interval) });
  },
  stopActiveProposalsDataPolling: () => {
    const interval = get().activeProposalsDataInterval;
    if (interval) {
      clearInterval(interval);
      set({ activeProposalsDataInterval: undefined });
    }
  },

  newProposalsInterval: undefined,
  startNewProposalsPolling: async () => {
    const currentInterval = get().newProposalsInterval;
    clearInterval(currentInterval);

    const func = async () => {
      const totalProposalsCount = await (isForIPFS
        ? fetchTotalProposalsCount({
            input: {
              govCoreClient:
                get().appClients[appConfig.govCoreChainId].instance,
            },
          })
        : api.configs.getProposalsCount.query());

      const currentProposalCount = get().totalProposalsCount;
      const configs = get().configs;

      if (Number(totalProposalsCount) > currentProposalCount && configs) {
        set({ totalProposalsCount: Number(totalProposalsCount) });
        const newIdsForFirstScreen = selectIdsForRequest(
          [...Array(Number(totalProposalsCount)).keys()].sort((a, b) => b - a),
          1,
          Number(totalProposalsCount) - currentProposalCount,
        );
        await get().updateProposalsListActiveData(newIdsForFirstScreen);
      }
    };
    func();

    const interval = setInterval(func, 15000);
    set({ newProposalsInterval: Number(interval) });
  },
  stopNewProposalsPolling: () => {
    const interval = get().newProposalsInterval;
    if (interval) {
      clearInterval(interval);
      set({ newProposalsInterval: undefined });
    }
  },

  updateProposalsListActiveData: async (activeIds, activePage) => {
    const configs = get().configs;
    if (configs && activeIds.length > 0) {
      if (
        activePage &&
        typeof get().updatedListDataLoading[activePage] === 'undefined'
      ) {
        set((state) =>
          produce(state, (draft) => {
            draft.updatedListDataLoading[activePage] = true;
          }),
        );
      }
      const input = {
        ...configs.contractsConstants,
        votingConfigs: configs.configs,
        activeIds,
      };
      const proposalsData = await (isForIPFS
        ? fetchActiveProposalsDataForList({
            input: {
              ...input,
              clients: selectAppClients(get()),
            },
          })
        : api.proposalsList.getActive.query(input));
      get().initializeProposalsListData(proposalsData);
      get().updateUserDataOnTheList();
      if (activePage) {
        set((state) =>
          produce(state, (draft) => {
            draft.updatedListDataLoading[activePage] = false;
          }),
        );
      }
    }
  },

  updateUserDataOnTheList: async () => {
    const proposalsData = Object.values(
      get().proposalsListData.activeProposalsData,
    ).map((proposal) => {
      return {
        id: BigInt(proposal.proposalId),
        votingChainId: proposal.votingChainId,
        votingAssets: proposal.votingAssets,
        isVotingFinished: proposal.isVotingFinished,
        snapshotBlockHash: proposal.snapshotBlockHash as Hex,
      };
    });
    const walletAddress =
      get().representative?.address || get().activeWallet?.address;

    if (walletAddress) {
      proposalsData.map(async (proposal) => {
        const key = `${walletAddress}_${proposal.snapshotBlockHash}`;
        if (!get().votedData[key]) {
          set((state) =>
            produce(state, (draft) => {
              draft.userDataLoadings[Number(proposal.id)] = true;
            }),
          );
        }
        await get().getVotedDataByUser(walletAddress, proposal);
        const data = selectProposalDataByUser({
          votedData: get().votedData,
          votingBalances: get().votingBalances,
          walletAddress,
          snapshotBlockHash: proposal.snapshotBlockHash,
        });
        if (
          !data.voted.isVoted &&
          proposal.snapshotBlockHash !== zeroHash &&
          !proposal.isVotingFinished
        ) {
          await get().getVotingBalancesByUser(walletAddress, proposal);
        }
        set((state) =>
          produce(state, (draft) => {
            draft.userDataLoadings[Number(proposal.id)] = false;
          }),
        );
      });
    }
  },

  updatedListDataLoading: {},
});
