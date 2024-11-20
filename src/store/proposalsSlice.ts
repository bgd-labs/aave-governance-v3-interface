import { StoreSlice } from '@bgd-labs/frontend-web3-utils';

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
    activeProposalsData: ActiveProposalOnTheList[];
    finishedProposalsData: ProposalOnTheList[];
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
    activeProposalsData: [],
    finishedProposalsData: [],
    // TODO: user data
  },
  initializeProposalsListData: (proposalsListData) => {
    const currentData = get().proposalsListData;
    const activeProposalsCurrent = currentData.activeProposalsData;
    const finishedProposalsCurrent = currentData.finishedProposalsData;

    const activeProposalsData: ActiveProposalOnTheList[] = [];
    for (let i = 0; i < proposalsListData.activeProposalsData.length; i++) {
      let found = false;
      for (let j = 0; j < activeProposalsCurrent.length; j++) {
        if (
          proposalsListData.activeProposalsData[i].proposalId ===
          activeProposalsCurrent[j].proposalId
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        activeProposalsData.push({
          ...proposalsListData.activeProposalsData[i],
        });
      }
    }

    const finishedProposalsData: ProposalOnTheList[] = [];
    for (let i = 0; i < proposalsListData.finishedProposalsData.length; i++) {
      let found = false;
      for (let j = 0; j < finishedProposalsCurrent.length; j++) {
        if (
          proposalsListData.finishedProposalsData[i].proposalId ===
          finishedProposalsCurrent[j].proposalId
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        finishedProposalsData.push({
          ...proposalsListData.finishedProposalsData[i],
        });
      }
    }

    set({
      proposalsListData: {
        activeProposalsData: [
          ...activeProposalsCurrent,
          ...activeProposalsData,
        ],
        finishedProposalsData: [
          ...finishedProposalsCurrent,
          ...finishedProposalsData,
        ],
      },
    });
  },

  activeProposalsDataInterval: undefined,
  startActiveProposalsDataPolling: async () => {
    const currentInterval = get().activeProposalsDataInterval;
    clearInterval(currentInterval);

    const func = async () => {
      const configs = get().configs;
      const activeIds = get().proposalsListData.activeProposalsData.map(
        (proposal) => proposal.proposalId,
      );
      if (configs && activeIds.length > 0) {
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
        const input = {
          ...configs.contractsConstants,
          votingConfigs: configs.configs,
          activeIds: newIdsForFirstScreen,
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
});
