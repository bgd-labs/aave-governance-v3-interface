import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Hex, zeroHash } from 'viem';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { DATA_POLLING_TIME } from '../configs/configs';
import { updateQueryParams } from '../helpers/updateQueryParams';
import { fetchActiveProposalsDataForList } from '../requests/fetchActiveProposalsDataForList';
import { fetchFilteredDataForList } from '../requests/fetchFilteredDataForList';
import { fetchTotalProposalsCount } from '../requests/fetchTotalProposalsCount';
import { api } from '../trpc/client';
import {
  ActiveProposalOnTheList,
  ProposalOnTheList,
  ProposalStateForFilters,
} from '../types';
import { IProposalsSlice } from './proposalsSlice';
import { IRepresentationsSlice } from './representationsSlice';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import {
  selectIdsForRequest,
  selectProposalDataByUser,
  selectProposalsForActivePage,
} from './selectors/proposalsSelector';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { IWeb3Slice } from './web3Slice';

export interface IProposalsListSlice {
  proposalsListData: {
    activeProposalsData: Record<number, ActiveProposalOnTheList>;
    finishedProposalsData: Record<number, ProposalOnTheList>;
  };
  initializeProposalsListData: ({
    proposalsListData,
    fromServer,
    fromPolling,
  }: {
    proposalsListData: {
      activeProposalsData: ActiveProposalOnTheList[];
      finishedProposalsData: ProposalOnTheList[];
    };
    fromServer?: boolean;
    fromPolling?: boolean;
  }) => void;
  initializeLoading: boolean;

  activeProposalsDataInterval: number | undefined;
  startActiveProposalsDataPolling: (activePage?: number) => Promise<void>;
  stopActiveProposalsDataPolling: () => void;

  newProposalsInterval: number | undefined;
  startNewProposalsPolling: (activePage: number) => Promise<void>;
  stopNewProposalsPolling: () => void;

  updateProposalsListActiveData: ({
    activeIds,
    activePage,
    rpcOnly,
  }: {
    activeIds: number[];
    activePage?: number;
    rpcOnly?: boolean;
    polling?: boolean;
  }) => Promise<void>;
  updateUserDataOnTheList: (rpcOnly?: boolean) => Promise<void>;

  updatedListDataLoading: Record<number, boolean>;

  paginationCount: number;
  filters: {
    state: ProposalStateForFilters | null;
    title: string | null;
    activePage: number | undefined;
    activeIds: number[];
  };
  filtersLoading: boolean;
  clearFilters: () => void;
  setStateFilter: (
    value: ProposalStateForFilters | null,
    router?: AppRouterInstance,
    withoutRequest?: boolean,
  ) => Promise<void>;
  setTitleFilter: (
    value: string | null,
    router?: AppRouterInstance,
    withoutRequest?: boolean,
    withoutLoading?: boolean,
  ) => Promise<void>;
  setActivePageFilter: (
    value: number | undefined,
    withoutRequest?: boolean,
  ) => Promise<void>;
  initializeFilters: () => Promise<void>;
  updateFilteredData: (withoutLoading?: boolean) => Promise<void>;
}

export const createProposalsListSlice: StoreSlice<
  IProposalsListSlice,
  IRpcSwitcherSlice & IProposalsSlice & IWeb3Slice & IRepresentationsSlice
> = (set, get) => ({
  proposalsListData: {
    activeProposalsData: {},
    finishedProposalsData: {},
  },
  initializeProposalsListData: ({
    proposalsListData,
    fromServer,
    fromPolling,
  }) => {
    const activeProposalsData = get().proposalsListData.activeProposalsData;
    const finishedProposalsData = get().proposalsListData.activeProposalsData;
    if (
      !Object.values(activeProposalsData).length &&
      !Object.values(finishedProposalsData).length
    ) {
      set({ initializeLoading: true });
    }

    proposalsListData.activeProposalsData.forEach((proposal) => {
      set((state) =>
        produce(state, (draft) => {
          const activeProposal =
            draft.proposalsListData.activeProposalsData[proposal.proposalId];
          const finishedProposal =
            draft.proposalsListData.finishedProposalsData[proposal.proposalId];

          if (!activeProposal && !finishedProposal && fromServer) {
            draft.proposalsListData.activeProposalsData[proposal.proposalId] =
              proposal;
          } else if (!fromServer && !finishedProposal) {
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
          const activeProposal =
            draft.proposalsListData.activeProposalsData[proposal.proposalId];
          const finishedProposal = proposal;
          if (finishedProposal) {
            if (isForIPFS && activeProposal) {
              draft.proposalsListData.finishedProposalsData[
                proposal.proposalId
              ] = {
                ...finishedProposal,
                isActive: true,
              };
            } else if (isForIPFS && fromPolling) {
              draft.proposalsListData.finishedProposalsData[
                proposal.proposalId
              ] = {
                ...finishedProposal,
                isActive: true,
              };
            }
            delete draft.proposalsListData.activeProposalsData[
              proposal.proposalId
            ];
          }
        }),
      );
    });

    set({ initializeLoading: false });
  },
  initializeLoading: true,

  activeProposalsDataInterval: undefined,
  startActiveProposalsDataPolling: async (activePage) => {
    const currentInterval = get().activeProposalsDataInterval;
    clearInterval(currentInterval);

    const func = async () => {
      const configs = get().configs;
      const activeIds = selectProposalsForActivePage({
        filters: get().filters,
        totalProposalsCount: get().totalProposalsCount,
        proposalsData: {
          activeProposalsData: Object.values(
            get().proposalsListData.activeProposalsData,
          ),
          finishedProposalsData: Object.values(
            get().proposalsListData.finishedProposalsData,
          ),
        },
        activePage: activePage ?? 1,
      }).activeProposalsData.map((proposal) => proposal.proposalId);
      if (configs && activeIds.length > 0) {
        await get().updateProposalsListActiveData({
          activeIds,
          activePage,
          polling: true,
        });
      }
    };

    const interval = setInterval(func, DATA_POLLING_TIME);
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
  startNewProposalsPolling: async (activePage) => {
    const currentInterval = get().newProposalsInterval;
    clearInterval(currentInterval);

    const func = async (rpcOnly?: boolean) => {
      const totalProposalsCount = await (isForIPFS
        ? fetchTotalProposalsCount({
            input: {
              govCoreClient:
                get().appClients[appConfig.govCoreChainId].instance,
              rpcOnly,
            },
          })
        : api.configs.getProposalsCount.query({ rpcOnly }));

      const currentProposalCount = get().totalProposalsCount;
      const configs = get().configs;

      if (Number(totalProposalsCount) > currentProposalCount && configs) {
        set({
          totalProposalsCount: Number(totalProposalsCount),
          paginationCount: Number(totalProposalsCount),
        });
        const newIdsForFirstScreen = selectIdsForRequest(
          [...Array(Number(totalProposalsCount)).keys()].sort((a, b) => b - a),
          1,
          Number(totalProposalsCount) - currentProposalCount,
        );
        await get().updateProposalsListActiveData({
          activeIds: newIdsForFirstScreen,
          rpcOnly,
          polling: true,
        });
      }
    };
    if (activePage === 1) {
      func(true);
    }
    const interval = setInterval(func, DATA_POLLING_TIME);
    set({ newProposalsInterval: Number(interval) });
  },
  stopNewProposalsPolling: () => {
    const interval = get().newProposalsInterval;
    if (interval) {
      clearInterval(interval);
      set({ newProposalsInterval: undefined });
    }
  },

  updateProposalsListActiveData: async ({
    activeIds,
    activePage,
    rpcOnly,
    polling,
  }) => {
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
        rpcOnly,
      };
      const proposalsData = await (isForIPFS
        ? fetchActiveProposalsDataForList({
            input: {
              ...input,
              clients: selectAppClients(get()),
            },
          })
        : api.proposalsList.getActive.query(input));
      get().initializeProposalsListData({
        proposalsListData: proposalsData,
        fromPolling: polling,
      });
      get().updateUserDataOnTheList(rpcOnly);
      if (activePage) {
        set((state) =>
          produce(state, (draft) => {
            draft.updatedListDataLoading[activePage] = false;
          }),
        );
      }
    }
  },

  updateUserDataOnTheList: async (rpcOnly) => {
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
        await get().getVotedDataByUser(walletAddress, proposal, rpcOnly);
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

  paginationCount: -1,
  filters: {
    state: null,
    title: null,
    activePage: undefined,
    activeIds: [],
  },
  filtersLoading: false,
  clearFilters: () => {
    set({
      paginationCount: get().totalProposalsCount,
      filters: {
        state: null,
        title: null,
        activePage: undefined,
        activeIds: [],
      },
    });
  },
  setStateFilter: async (value, router, withoutRequest) => {
    set((state) =>
      produce(state, (draft) => {
        draft.filters = {
          ...draft.filters,
          activePage: 1,
          state: value,
        };
      }),
    );
    if (router) {
      updateQueryParams({
        router,
        params: { state: [String(value || '')] },
        pathName: '/',
      });
    }
    if (!withoutRequest) {
      await get().updateFilteredData();
    }
  },
  setTitleFilter: async (value, router, withoutRequest, withoutLoading) => {
    set((state) =>
      produce(state, (draft) => {
        draft.filters = {
          ...draft.filters,
          title: value,
        };
      }),
    );
    if (router) {
      updateQueryParams({
        router,
        params: { title: [String(value || '')] },
        pathName: '/',
      });
    }
    if (!withoutRequest) {
      await get().updateFilteredData(withoutLoading);
      set((state) =>
        produce(state, (draft) => {
          draft.filters = {
            ...draft.filters,
            activePage: 1,
          };
        }),
      );
    }
  },
  setActivePageFilter: async (value, withoutRequest) => {
    set((state) =>
      produce(state, (draft) => {
        draft.filters = {
          ...draft.filters,
          activePage: value,
        };
      }),
    );
    if (!withoutRequest) {
      await get().updateFilteredData();
    }
  },
  initializeFilters: async () => {
    const search = window.location.search.substr(1);
    const queryParams = new URLSearchParams(search);
    for (const [key, value] of queryParams.entries()) {
      if (value) {
        if (key === 'state') {
          await get().setStateFilter(
            Number(value) as ProposalStateForFilters | null,
            undefined,
            true,
          );
        }
        if (key === 'title' && value !== '') {
          await get().setTitleFilter(value, undefined, true);
        }
      }
    }
    await get().updateFilteredData();
  },
  updateFilteredData: async (withoutLoading) => {
    const configs = get().configs;
    get().stopActiveProposalsDataPolling();
    get().stopNewProposalsPolling();

    if (
      configs &&
      (get().filters.state !== null || get().filters.title !== null)
    ) {
      if (!withoutLoading) {
        set({ filtersLoading: true });
      }

      const input = {
        ...configs.contractsConstants,
        votingConfigs: configs.configs,
        activePage: get().filters.activePage,
        state: get().filters.state,
        title: get().filters.title,
      };

      const data = await (isForIPFS
        ? fetchFilteredDataForList({
            input: { ...input, clients: selectAppClients(get()) },
          })
        : api.proposalsList.getFilteredProposals.query(input));

      if (data) {
        set((state) =>
          produce(state, (draft) => {
            draft.filters.activeIds = data.ids;
          }),
        );
        get().initializeProposalsListData({ proposalsListData: data.data });
        set({
          paginationCount: data.count ?? -1,
        });
      }
      set({ filtersLoading: false });
    }
  },
});
