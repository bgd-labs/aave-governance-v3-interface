import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Address, Hex } from 'viem';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { fetchConfigs } from '../requests/fetchConfigs';
import { fetchProposalsBalancesByUser } from '../requests/fetchProposalsBalancesByUser';
import { fetchProposalsDataByUser } from '../requests/fetchProposalsDataByUser';
import { fetchTotalProposalsCount } from '../requests/fetchTotalProposalsCount';
import { api } from '../trpc/client';
import {
  ContractsConstants,
  ProposalToGetUserData,
  VotedDataByUser,
  VotingConfig,
  VotingDataByUser,
} from '../types';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectVotingBalanceByUser } from './selectors/proposalsSelector';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';

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

  votedData: Record<string, VotedDataByUser>;
  getVotedDataByUser: (
    walletAddress: string,
    proposal: ProposalToGetUserData,
  ) => Promise<void>;

  votingBalances: Record<string, VotingDataByUser[]>;
  getVotingBalancesByUser: (
    walletAddress: string,
    proposal: {
      votingAssets: string[];
      snapshotBlockHash: string;
    },
  ) => Promise<void>;

  userDataLoadings: Record<number, boolean>;
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

  votedData: {},
  getVotedDataByUser: async (walletAddress, proposal) => {
    const key = `${walletAddress}_${proposal.snapshotBlockHash}`;
    const votingBalance = selectVotingBalanceByUser({
      votingBalances: get().votingBalances,
      walletAddress,
      snapshotBlockHash: proposal.snapshotBlockHash,
    });
    if (
      !get().votedData[key] ||
      (!get().votedData[key].isVoted && votingBalance > 0n)
    ) {
      const input = {
        initialProposals: [proposal],
        walletAddress,
      };
      const data = await (isForIPFS
        ? fetchProposalsDataByUser({
            input: {
              clients: selectAppClients(get()),
              ...input,
            },
          })
        : api.proposals.getProposalVotedData.query(input));
      set((state) =>
        produce(state, (draft) => {
          draft.votedData[key] = data[0];
        }),
      );
    }
  },
  votingBalances: {},
  getVotingBalancesByUser: async (walletAddress, proposal) => {
    const key = `${walletAddress}_${proposal.snapshotBlockHash}`;
    if (!get().votingBalances[key]) {
      const input = {
        address: walletAddress as Address,
        assets: proposal.votingAssets as Address[],
        blockHash: proposal.snapshotBlockHash as Hex,
      };
      const data = await (isForIPFS
        ? fetchProposalsBalancesByUser({
            input: {
              client: get().appClients[appConfig.govCoreChainId].instance,
              ...input,
            },
          })
        : api.proposals.getWalletBalancesForProposal.query(input));
      set((state) =>
        produce(state, (draft) => {
          draft.votingBalances[key] = data;
        }),
      );
    }
  },

  userDataLoadings: {},
});
