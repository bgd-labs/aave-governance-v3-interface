import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { PAGE_SIZE } from '../configs/configs';
import { fetchActiveProposalsDataForList } from '../requests/fetchActiveProposalsDataForList';
import { fetchConfigs } from '../requests/fetchConfigs';
import { fetchTotalProposalsCount } from '../requests/fetchTotalProposalsCount';
import { api } from '../trpc/client';
import {
  ActiveProposalOnTheList,
  ContractsConstants,
  ProposalOnTheList,
  VotingConfig,
} from '../types';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';

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

export interface IProposalsSlice {
  configs?: {
    configs: VotingConfig[];
    contractsConstants: ContractsConstants;
  };
  initializeConfigs: (configs?: {
    configs: VotingConfig[];
    contractsConstants: ContractsConstants;
  }) => Promise<void>;

  totalProposalsCount: number;
  initializeProposalsCount: (count?: number) => Promise<void>;

  proposalsListData: {
    activeProposalsData: Record<number, ActiveProposalOnTheList>;
    finishedProposalsData: Record<number, ProposalOnTheList>;
  };
  initializeProposalsListData: (proposalsListData: {
    activeProposalsData: ActiveProposalOnTheList[];
    finishedProposalsData: ProposalOnTheList[];
  }) => void;

  activeProposalsDataInterval: number | undefined;
  startActiveProposalsDataPolling: () => Promise<void>;
  stopActiveProposalsDataPolling: () => void;

  newProposalsInterval: number | undefined;
  startNewProposalsPolling: () => Promise<void>;
  stopNewProposalsPolling: () => void;

  updateProposalsListActiveData: (activeIds: number[]) => Promise<void>;
}

export const createProposalsSlice: StoreSlice<
  IProposalsSlice,
  IRpcSwitcherSlice
> = (set, get) => ({
  initializeConfigs: async (configs) => {
    if (configs && !get().configs) {
      set({ configs });
    } else if (!get().configs) {
      const configsFromRequest = await (isForIPFS
        ? fetchConfigs({
            input: {
              govCoreClient:
                get().appClients[appConfig.govCoreChainId].instance,
            },
          })
        : api.configs.get.query());
      set({ configs: configsFromRequest });
    }
  },

  totalProposalsCount: -1,
  initializeProposalsCount: async (count) => {
    if (count && count > get().totalProposalsCount) {
      set({ totalProposalsCount: count });
    } else {
      const totalProposalsCount = await (isForIPFS
        ? fetchTotalProposalsCount({
            input: {
              govCoreClient:
                get().appClients[appConfig.govCoreChainId].instance,
            },
          })
        : api.configs.getProposalsCount.query());
      if (Number(totalProposalsCount) > get().totalProposalsCount) {
        set({ totalProposalsCount: Number(totalProposalsCount) });
      }
    }
  },

  proposalsListData: {
    activeProposalsData: {},
    finishedProposalsData: {},
    // TODO: user data
  },
  initializeProposalsListData: (proposalsListData) => {
    proposalsListData.activeProposalsData.forEach((proposal) => {
      set((state) =>
        produce(state, (draft) => {
          draft.proposalsListData.activeProposalsData[proposal.proposalId] =
            proposal;
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
  },

  activeProposalsDataInterval: undefined,
  startActiveProposalsDataPolling: async () => {
    const currentInterval = get().activeProposalsDataInterval;
    clearInterval(currentInterval);

    const func = async () => {
      const configs = get().configs;
      const activeIds = Object.values(
        get().proposalsListData.activeProposalsData,
      ).map((proposal) => proposal.proposalId);
      if (configs && activeIds.length > 0) {
        await get().updateProposalsListActiveData(activeIds);
      }
    };
    func();

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

  updateProposalsListActiveData: async (activeIds) => {
    const configs = get().configs;
    if (configs) {
      const input = {
        ...configs.contractsConstants,
        votingConfigs: configs.configs,
        activeIds,
      };
      // TODO: user data
      const proposalsData = await (isForIPFS
        ? fetchActiveProposalsDataForList({
            input: {
              ...input,
              clients: Object.values(get().appClients).map(
                (client) => client.instance,
              ),
            },
          })
        : api.proposalsList.getActive.query(input));
      get().initializeProposalsListData(proposalsData);
    }
  },
});
