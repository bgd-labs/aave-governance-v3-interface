import { StoreSlice } from '@bgd-labs/frontend-web3-utils';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { PAGE_SIZE } from '../configs/configs';
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

export const selectIdsForRequest = (ids: number[], activePage: number) => {
  const startIndex = Number(activePage - 1) * PAGE_SIZE;
  let endIndex = startIndex + PAGE_SIZE;
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
}

export const createProposalsSlice: StoreSlice<
  IProposalsSlice,
  IRpcSwitcherSlice
> = (set, get) => ({
  initializeConfigs: async (configs) => {
    if (configs) {
      set({ configs });
    } else {
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
    if (count) {
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
      set({ totalProposalsCount: Number(totalProposalsCount) });
    }
  },

  proposalsListData: {
    activeProposalsData: [],
    finishedProposalsData: [],
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
});
