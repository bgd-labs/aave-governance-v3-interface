import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { Draft, produce } from 'immer';
import { zeroHash } from 'viem';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { generateSeatbeltLink } from '../helpers/formatPayloadData';
import { fetchCreatorPropositionPower } from '../requests/fetchCreatorPropositionPower';
import { fetchProposalDataForDetails } from '../requests/fetchProposalDataForDetails';
import { GetCreatorPropositionPower } from '../requests/utils/getOwnerPropositionPowerRPC';
import { api } from '../trpc/client';
import { DetailedProposalData, PayloadInitialStruct } from '../types';
import { IProposalsSlice } from './proposalsSlice';
import { IRepresentationsSlice } from './representationsSlice';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectProposalDataByUser } from './selectors/proposalsSelector';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { IWeb3Slice } from './web3Slice';

export interface IProposalSlice {
  proposalDetails: Record<number, DetailedProposalData>;
  initializeProposalDetails: (data: DetailedProposalData) => void;
  getProposalDetails: (id: number) => Promise<void>;
  proposalDetailsLoading: Record<number, boolean>;

  activeProposalDetailsInterval: number | undefined;
  startActiveProposalDetailsPolling: (id: number) => Promise<void>;
  stopActiveProposalDetailsPolling: () => void;

  updateDetailsUserData: (id: number) => Promise<void>;

  creatorPropositionPower: Record<string, number>;
  getCreatorPropositionPower: ({
    creatorAddress,
    underlyingAssets,
  }: Omit<GetCreatorPropositionPower, 'govCoreClient'>) => Promise<void>;

  seatbeltReportsLoadings: Record<string, boolean>;
  getSeatbeltReport: ({
    proposalId,
    payload,
  }: {
    proposalId: number;
    payload: PayloadInitialStruct;
  }) => Promise<void>;
}

export const createProposalSlice: StoreSlice<
  IProposalSlice,
  IProposalsSlice & IRpcSwitcherSlice & IWeb3Slice & IRepresentationsSlice
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
      if (typeof get().proposalDetailsLoading[id] === 'undefined') {
        set((state) =>
          produce(state, (draft) => {
            draft.proposalDetailsLoading[id] = true;
          }),
        );
      }
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
      await get().updateDetailsUserData(id);
      if (!data.formattedData.isFinished) {
        await get().getCreatorPropositionPower({
          creatorAddress: data.proposalData.creator,
          underlyingAssets: data.votingData.votingAssets as string[],
        });
      }
      set((state) =>
        produce(state, (draft) => {
          draft.proposalDetailsLoading[id] = false;
        }),
      );
    }
  },
  proposalDetailsLoading: {},

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
    const walletAddress =
      get().representative?.address || get().activeWallet?.address;
    const proposal = get().proposalDetails[id];
    if (walletAddress && proposal) {
      const key = `${walletAddress}_${proposal.proposalData.snapshotBlockHash}`;
      if (!get().votedData[key]) {
        set((state) =>
          produce(state, (draft) => {
            draft.userDataLoadings[Number(proposal.proposalData.id)] = true;
          }),
        );
      }
      await get().getVotedDataByUser(walletAddress, {
        id: BigInt(proposal.proposalData.id),
        snapshotBlockHash: proposal.proposalData.snapshotBlockHash,
        votingChainId: proposal.votingData.votingChainId,
      });
      const data = selectProposalDataByUser({
        votedData: get().votedData,
        votingBalances: get().votingBalances,
        walletAddress,
        snapshotBlockHash: proposal.proposalData.snapshotBlockHash,
      });
      if (
        !data.voted.isVoted &&
        proposal.proposalData.snapshotBlockHash !== zeroHash &&
        !proposal.formattedData.isVotingFinished
      ) {
        await get().getVotingBalancesByUser(walletAddress, {
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

  creatorPropositionPower: {},
  getCreatorPropositionPower: async ({ creatorAddress, underlyingAssets }) => {
    const input = {
      creatorAddress,
      underlyingAssets,
    };

    const power = await (isForIPFS
      ? fetchCreatorPropositionPower({
          input: {
            govCoreClient: selectAppClients(get())[appConfig.govCoreChainId],
            ...input,
          },
        })
      : api.proposals.getCreatorPropositionPower.query(input));

    set((state) =>
      produce(state, (draft) => {
        draft.creatorPropositionPower[creatorAddress] = power;
      }),
    );
  },

  seatbeltReportsLoadings: {},
  getSeatbeltReport: async ({ proposalId, payload }) => {
    set((state) =>
      produce(state, (draft) => {
        draft.seatbeltReportsLoadings[
          `${proposalId}_${payload.payloadsController}_${payload.id}`
        ] = true;
      }),
    );
    const seatbeltMDRequest = await fetch(generateSeatbeltLink(payload));
    const seatbeltMD = seatbeltMDRequest.ok
      ? await seatbeltMDRequest.text()
      : undefined;
    set((state) =>
      produce(state, (draft) => {
        draft.proposalDetails[proposalId] = {
          ...draft.proposalDetails[proposalId],
          payloadsData: draft.proposalDetails[proposalId].payloadsData.map(
            (p) => {
              if (
                p.payloadsController === payload.payloadsController &&
                p.chain === payload.chain &&
                p.id === payload.id
              ) {
                return {
                  ...p,
                  seatbeltMD,
                };
              }
              return p;
            },
          ),
        };
        draft.seatbeltReportsLoadings[
          `${proposalId}_${payload.payloadsController}_${payload.id}`
        ] = false;
      }),
    );
  },
});
