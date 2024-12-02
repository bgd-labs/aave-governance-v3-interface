import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { Draft, produce } from 'immer';
import { zeroHash } from 'viem';

import { isForIPFS } from '../configs/appConfig';
import { fetchProposalDataForDetails } from '../requests/fetchProposalDataForDetails';
import { api } from '../trpc/client';
import { DetailedProposalData } from '../types';
import { IProposalsSlice } from './proposalsSlice';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectProposalDataByUser } from './selectors/proposalsSelector';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { IWeb3Slice } from './web3Slice';

export interface IProposalSlice {
  proposalDetails: Record<number, DetailedProposalData>;
  initializeProposalDetails: (data: DetailedProposalData) => void;
  getProposalDetails: (id: number) => Promise<void>;

  activeProposalDetailsInterval: number | undefined;
  startActiveProposalDetailsPolling: (id: number) => Promise<void>;
  stopActiveProposalDetailsPolling: () => void;

  updateDetailsUserData: (id: number) => Promise<void>;
}

export const createProposalSlice: StoreSlice<
  IProposalSlice,
  IProposalsSlice & IRpcSwitcherSlice & IWeb3Slice
> = (set, get) => ({
  proposalDetails: {},
  initializeProposalDetails: (data) => {
    const currentData = get().proposalDetails[data.proposalData.id];
    if (currentData && !currentData.formattedData.isFinished) {
      set((state) =>
        produce(state, (draft) => {
          draft.proposalDetails[data.proposalData.id] =
            data as Draft<DetailedProposalData>;
        }),
      );
    } else if (!currentData) {
      set((state) =>
        produce(state, (draft) => {
          draft.proposalDetails[data.proposalData.id] =
            data as Draft<DetailedProposalData>;
        }),
      );
    }
  },
  getProposalDetails: async (id) => {
    const configs = get().configs;
    if (configs) {
      const input = {
        ...configs.contractsConstants,
        votingConfigs: configs.configs,
        proposalId: id,
      };
      const data = await (isForIPFS
        ? fetchProposalDataForDetails({
            input: {
              clients: selectAppClients(get()),
              ...input,
            },
          })
        : api.proposals.getDetails.query(input));
      get().initializeProposalDetails(data);
      get().updateDetailsUserData(id);
    }
  },

  activeProposalDetailsInterval: undefined,
  startActiveProposalDetailsPolling: async (id) => {
    const currentInterval = get().activeProposalDetailsInterval;
    clearInterval(currentInterval);
    const interval = setInterval(() => get().getProposalDetails(id), 30000);
    set({ activeProposalDetailsInterval: Number(interval) });
  },
  stopActiveProposalDetailsPolling: () => {
    const interval = get().activeProposalDetailsInterval;
    if (interval) {
      clearInterval(interval);
      set({ activeProposalDetailsInterval: undefined });
    }
  },

  updateDetailsUserData: async (id) => {
    const activeWallet = get().activeWallet;
    const proposal = get().proposalDetails[id];
    if (activeWallet && proposal) {
      const key = `${activeWallet.address}_${proposal.proposalData.snapshotBlockHash}`;
      if (!get().votedData[key]) {
        set((state) =>
          produce(state, (draft) => {
            draft.userDataLoadings[Number(proposal.proposalData.id)] = true;
          }),
        );
      }
      await get().getVotedDataByUser(activeWallet.address, {
        id: BigInt(proposal.proposalData.id),
        snapshotBlockHash: proposal.proposalData.snapshotBlockHash,
        votingChainId: proposal.votingData.votingChainId,
      });
      const data = selectProposalDataByUser({
        votedData: get().votedData,
        votingBalances: get().votingBalances,
        walletAddress: activeWallet.address,
        snapshotBlockHash: proposal.proposalData.snapshotBlockHash,
      });
      if (
        !data.voted.isVoted &&
        proposal.proposalData.snapshotBlockHash !== zeroHash &&
        !proposal.formattedData.isVotingFinished
      ) {
        await get().getVotingBalancesByUser(activeWallet.address, {
          votingAssets: proposal.votingData.votingAssets as string[],
          snapshotBlockHash: proposal.proposalData.snapshotBlockHash,
        });
      }
      set((state) =>
        produce(state, (draft) => {
          draft.userDataLoadings[Number(proposal.proposalData.id)] = false;
        }),
      );
    }
  },
});
