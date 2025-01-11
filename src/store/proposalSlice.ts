import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { Draft, produce } from 'immer';
import { Hex, zeroHash } from 'viem';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { DATA_POLLING_TIME } from '../configs/configs';
import { generateSeatbeltLink } from '../helpers/formatPayloadData';
import { fetchCreatorPropositionPower } from '../requests/fetchCreatorPropositionPower';
import { fetchProposalDataForDetails } from '../requests/fetchProposalDataForDetails';
import { FetchVoters, fetchVoters } from '../requests/fetchVoters';
import { GetCreatorPropositionPower } from '../requests/utils/getOwnerPropositionPowerRPC';
import { api } from '../trpc/client';
import {
  DetailedProposalData,
  ENSProperty,
  PayloadInitialStruct,
  VotersData,
} from '../types';
import { IEnsSlice } from './ensSlice';
import { IProposalsSlice } from './proposalsSlice';
import { IRepresentationsSlice } from './representationsSlice';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { ENSDataExists } from './selectors/ensSelectors';
import {
  selectProposalDataByUser,
  selectVotersByProposalId,
} from './selectors/proposalsSelector';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { IWeb3Slice } from './web3Slice';

type GetVotersParams = Omit<FetchVoters, 'clients'>;

export interface IProposalSlice {
  proposalDetails: Record<number, DetailedProposalData>;
  initializeProposalDetails: (data: DetailedProposalData) => void;
  getProposalDetails: (id: number, rpcOnly?: boolean) => Promise<void>;
  proposalDetailsLoading: Record<number, boolean>;

  activeProposalDetailsInterval: number | undefined;
  startActiveProposalDetailsPolling: (id: number) => Promise<void>;
  stopActiveProposalDetailsPolling: () => void;

  updateDetailsUserData: (id: number, rpcOnly?: boolean) => Promise<void>;

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

  voters: Record<Hex, VotersData>;
  setVoters: (voters: VotersData[]) => void;
  getVoters: ({
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
    proposalId,
    votingChainId,
    rpcOnly,
  }: GetVotersParams) => Promise<void>;
  getVotersLoading: Record<
    number,
    { initialLoading: boolean; loading: boolean }
  >;
  getVotersInterval: number | undefined;
  startVotersPolling: ({
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
    proposalId,
    votingChainId,
  }: GetVotersParams) => Promise<void>;
  stopVotersPolling: () => void;
}

export const createProposalSlice: StoreSlice<
  IProposalSlice,
  IProposalsSlice &
    IRpcSwitcherSlice &
    IWeb3Slice &
    IRepresentationsSlice &
    IEnsSlice
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
  getProposalDetails: async (id, rpcOnly) => {
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
        rpcOnly,
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
      await get().updateDetailsUserData(id, rpcOnly);
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
    const interval = setInterval(
      () => get().getProposalDetails(id),
      DATA_POLLING_TIME,
    );
    set({ activeProposalDetailsInterval: Number(interval) });
  },
  stopActiveProposalDetailsPolling: () => {
    const interval = get().activeProposalDetailsInterval;
    if (interval) {
      clearInterval(interval);
      set({ activeProposalDetailsInterval: undefined });
    }
  },

  updateDetailsUserData: async (id, rpcOnly) => {
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
      await get().getVotedDataByUser(
        walletAddress,
        {
          id: BigInt(proposal.proposalData.id),
          snapshotBlockHash: proposal.proposalData.snapshotBlockHash,
          votingChainId: proposal.votingData.votingChainId,
        },
        rpcOnly,
      );
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

  voters: {},
  setVoters: (voters) => {
    set((state) =>
      produce(state, (draft) => {
        voters.forEach((votersData) => {
          draft.voters[votersData.transactionHash] = votersData;
        });
      }),
    );
  },
  getVoters: async ({
    proposalId,
    votingChainId,
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
    rpcOnly,
  }) => {
    set((state) =>
      produce(state, (draft) => {
        draft.getVotersLoading[proposalId] = {
          initialLoading:
            typeof draft.getVotersLoading[proposalId] !== 'undefined'
              ? draft.getVotersLoading[proposalId].initialLoading
              : true,
          loading: true,
        };
      }),
    );

    const input = {
      proposalId,
      votingChainId,
      startBlockNumber,
      endBlockNumber,
      lastBlockNumber,
      rpcOnly,
    };

    const votersData = await (isForIPFS
      ? fetchVoters({
          input: {
            clients: selectAppClients(get()),
            ...input,
          },
        })
      : api.proposals.getVoters.query(input));

    set((state) =>
      produce(state, (draft) => {
        votersData.forEach((vote) => {
          draft.voters[vote.transactionHash] = {
            ...vote,
            ensName: ENSDataExists(
              get().ensData,
              vote.address,
              ENSProperty.NAME,
            )
              ? get().ensData[vote.address.toLocaleLowerCase() as Hex].name
              : vote.ensName,
          };
        });
      }),
    );

    const topVotersByProposalIdWithENS = await Promise.all(
      selectVotersByProposalId(get().voters, proposalId)
        .votersLocal.sort((a, b) => b.votingPower - a.votingPower)
        .slice(0, 5)
        .map(async (vote) => {
          if (vote.ensName) {
            return vote;
          } else {
            await get().fetchEnsNameByAddress(vote.address);
            const ensName =
              get().ensData[vote.address.toLocaleLowerCase() as Hex]?.name;
            if (ensName) {
              return {
                ...vote,
                ensName,
              };
            } else {
              return vote;
            }
          }
        }),
    );

    set((state) =>
      produce(state, (draft) => {
        topVotersByProposalIdWithENS.forEach((vote) => {
          draft.voters[vote.transactionHash] = {
            ...vote,
            ensName: ENSDataExists(
              get().ensData,
              vote.address,
              ENSProperty.NAME,
            )
              ? get().ensData[vote.address.toLocaleLowerCase() as Hex].name
              : vote.ensName,
          };
        });
      }),
    );

    set((state) =>
      produce(state, (draft) => {
        draft.getVotersLoading[proposalId] = {
          initialLoading: false,
          loading: false,
        };
      }),
    );
  },
  getVotersLoading: {},

  getVotersInterval: undefined,
  startVotersPolling: async ({
    proposalId,
    votingChainId,
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
  }) => {
    const currentInterval = get().getVotersInterval;
    clearInterval(currentInterval);
    const interval = setInterval(() => {
      get().getVoters({
        proposalId,
        votingChainId,
        startBlockNumber,
        endBlockNumber,
        lastBlockNumber,
      });
    }, DATA_POLLING_TIME);
    set({ getVotersInterval: Number(interval) });
  },
  stopVotersPolling: () => {
    const interval = get().getVotersInterval;
    if (interval) {
      clearInterval(interval);
      set(() => ({ getVotersInterval: undefined }));
    }
  },
});
