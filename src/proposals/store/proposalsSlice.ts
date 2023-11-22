import {
  Balance,
  BasicProposal,
  checkHash,
  ContractsConstants,
  getProposalMetadata,
  getProposalStepsAndAmounts,
  getVotingMachineProposalState,
  InitialPayload,
  normalizeBN,
  Payload,
  PayloadAction,
  ProposalData,
  ProposalMetadata,
  valueToBigNumber,
  VotersData,
  VotingBalance,
  VotingConfig,
} from '@bgd-labs/aave-governance-ui-helpers';
import { IWalletSlice, StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { Draft, produce } from 'immer';
import { Hex } from 'viem';

import { ICreateByParamsSlice } from '../../createByParams/store/createByParamsSlice';
import { IDelegationSlice } from '../../delegate/store/delegationSlice';
import { IPayloadsExplorerSlice } from '../../payloadsExplorer/store/payloadsExplorerSlice';
import { IRepresentationsSlice } from '../../representations/store/representationsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { ipfsGateway } from '../../utils/configs';
import { PAGE_SIZE } from '../../web3/services/govDataService';
import { ENSDataExists } from '../../web3/store/ensSelectors';
import { ENSProperty, IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import {
  formatBalances,
  getProofOfRepresentative,
  getVotingAssetsWithSlot,
  getVotingProofs,
} from '../utils/formatBalances';
import { IProposalsHistorySlice } from './proposalsHistorySlice';
import { IProposalsListCacheSlice } from './proposalsListCacheSlice';
import {
  getProposalTitle,
  selectConfigByAccessLevel,
  selectPaginatedIds,
  selectProposalIds,
  selectVotersByProposalId,
} from './proposalsSelectors';

export interface IProposalsSlice {
  isInitialLoading: boolean;

  totalProposalCount: number;
  totalProposalCountLoading: boolean;
  getTotalProposalCount: (internal?: boolean) => Promise<void>;
  setTotalProposalCount: (value: number) => void;

  totalPayloadsCount: Record<string, number>;
  initialPayloadsCount: Record<string, number>;
  getTotalPayloadsCount: () => Promise<void>;

  filteredState: number | null;
  setFilteredState: (value: number | null) => void;

  titleSearchValue: string | undefined;
  setTitleSearchValue: (value: string | undefined) => void;

  activePage: number;
  setActivePage: (activePage: number) => void;
  getPaginatedProposalsData: () => Promise<void>;
  getPaginatedProposalsDataWithoutIpfs: () => Promise<void>;
  updatePaginatedProposalsData: () => void;
  getProposalDataWithIpfsById: (id: number) => Promise<void>;

  setGovCoreConfigs: () => Promise<void>;
  setSSRGovCoreConfigs: (
    configs: VotingConfig[],
    contractsConstants: ContractsConstants,
  ) => void;
  configs: VotingConfig[];
  contractsConstants: ContractsConstants;

  detailedPayloadsData: Record<string, Payload>;
  setDetailedPayloadsData: (key: string, data: Payload) => void;
  getDetailedPayloadsData: (
    chainId: number,
    payloadsController: Hex,
    ids: number[],
  ) => Promise<void>;

  ipfsData: Record<string, ProposalMetadata>;
  ipfsDataErrors: Record<string, string>;
  setIpfsDataErrors: (ipfsHash: string, text?: string) => void;
  setIpfsData: (hash: string, data: ProposalMetadata) => void;
  getIpfsData: (ids: number[], hash?: Hex) => Promise<void>;

  detailedProposalsData: Record<number, ProposalData>;
  detailedProposalsDataLoadings: Record<number, boolean>;
  setDetailedProposalsDataLoadings: (id: number) => void;
  detailedProposalsDataLoading: boolean;
  setDetailedProposalsData: (id: number, data: ProposalData) => void;
  getDetailedProposalsData: (
    ids: number[],
    from?: number,
    to?: number,
    pageSize?: number,
  ) => void;
  detailedProposalDataInterval: number | undefined;
  startDetailedProposalDataPolling: (ids?: number[]) => Promise<void>;
  stopDetailedProposalDataPolling: () => void;

  newProposalsInterval: number | undefined;
  startNewProposalsPolling: () => Promise<void>;
  stopNewProposalsPolling: () => void;

  blockHashBalance: VotingBalance;
  blockHashBalanceLoadings: Record<string, boolean>;
  resetL1Balances: () => void;
  getL1Balances: (ids: number[]) => Promise<void>;

  creatorBalance: Record<string, number>;
  getProposalCreatorBalance: (
    creator: string,
    underlyingAssets: string[],
  ) => Promise<void>;

  voters: VotersData[];
  setVoters: (voters: VotersData[]) => void;
  getVoters: (
    proposalId: number,
    votingChainId: number,
    startBlockNumber: number,
    endBlockNumber?: number,
    lastBlockNumber?: number,
  ) => Promise<void>;
  getVotersLoading: Record<
    number,
    { initialLoading: boolean; loading: boolean }
  >;
  getVotersInterval: number | undefined;
  startVotersPolling: (
    proposalId: number,
    votingChainId: number,
    startBlockNumber: number,
    endBlockNumber: number,
    lastBlockNumber: number,
  ) => Promise<void>;
  stopVotersPolling: () => void;

  supportObject: Record<number, boolean>;
  fullClearSupportObject: () => void;
  clearSupportObject: (proposalId: number) => void;
  setSupportObject: (proposalId: number, support: boolean) => void;

  activateVoting: (proposalId: number) => Promise<void>;
  sendProofs: (
    votingChainId: number,
    proposalId: number,
    asset: string,
    baseBalanceSlotRaw: number,
    withSlot?: boolean,
  ) => Promise<void>;
  activateVotingOnVotingMachine: (
    votingChainId: number,
    proposalId: number,
  ) => Promise<void>;
  vote: (params: {
    votingChainId: number;
    proposalId: number;
    support: boolean;
    balances: Balance[];
    gelato?: boolean;
    voterAddress?: string;
  }) => Promise<void>;
  closeAndSendVote: (
    votingChainId: number,
    proposalId: number,
  ) => Promise<void>;
  executeProposal: (proposalId: number) => Promise<void>;
  executePayload: (
    proposalId: number,
    payload: InitialPayload,
  ) => Promise<void>;

  createPayload: (
    chainId: number,
    payloadActions: PayloadAction[],
    payloadId: number,
    payloadsController: string,
  ) => Promise<void>;
  createProposal: (
    votingPortalAddress: string,
    payloads: InitialPayload[],
    ipfsHash: string,
  ) => Promise<void>;

  cancelProposal: (proposalId: number) => Promise<void>;
}

export const createProposalsSlice: StoreSlice<
  IProposalsSlice,
  IProposalsListCacheSlice &
    IWeb3Slice &
    TransactionsSlice &
    IWalletSlice &
    IDelegationSlice &
    IUISlice &
    IProposalsHistorySlice &
    IRepresentationsSlice &
    IEnsSlice &
    IRpcSwitcherSlice &
    ICreateByParamsSlice &
    IPayloadsExplorerSlice
> = (set, get) => ({
  isInitialLoading: true,

  totalProposalCount: -1,
  totalProposalCountLoading: false,
  getTotalProposalCount: async (internal) => {
    set({ totalProposalCountLoading: true });
    const totalProposalCount =
      await get().govDataService.getTotalProposalsCount(
        get().totalProposalCount,
        get().setRpcError,
      );
    set({ totalProposalCount, totalProposalCountLoading: false });
    if (internal) {
      set({ isInitialLoading: false });
    }
  },
  setTotalProposalCount: (value) => {
    if (value > get().totalProposalCount) {
      set({ totalProposalCount: value });
    }
  },

  totalPayloadsCount: {},
  initialPayloadsCount: {},
  getTotalPayloadsCount: async () => {
    await Promise.all(
      appConfig.payloadsControllerChainIds.map(async (chainId) => {
        await Promise.all(
          appConfig.payloadsControllerConfig[chainId].contractAddresses.map(
            async (payloadsController) => {
              const totalPayloadsCount =
                await get().govDataService.getTotalPayloadsCount(
                  payloadsController,
                  chainId,
                  get().setRpcError,
                );

              set({
                totalPayloadsCount: {
                  ...get().totalPayloadsCount,
                  [payloadsController]: totalPayloadsCount,
                },
                initialPayloadsCount: {
                  ...get().initialPayloadsCount,
                  [payloadsController]: totalPayloadsCount,
                },
              });
            },
          ),
        );
      }),
    );
  },

  filteredState: null,
  setFilteredState: (value) => {
    set({ filteredState: value });
  },

  titleSearchValue: undefined,
  setTitleSearchValue: (value) => {
    if (!!value) {
      set({ titleSearchValue: value });
    } else {
      set({ titleSearchValue: undefined });
    }
  },

  activePage: 0,
  setActivePage: (activePage: number) => {
    set({ activePage: activePage });
  },

  getPaginatedProposalsData: async () => {
    if (get().isInitialLoading) {
      const rpcUrl = get().appClients[appConfig.govCoreChainId].rpcUrl;

      try {
        await get().getTotalProposalCount();
        get().setRpcError({
          isError: false,
          rpcUrl,
          chainId: appConfig.govCoreChainId,
        });
      } catch {
        get().setRpcError({
          isError: true,
          rpcUrl,
          chainId: appConfig.govCoreChainId,
        });
        return;
      }
      const paginatedIds = selectPaginatedIds(get());
      const { activeIds } = selectProposalIds(get(), paginatedIds);
      await get().getDetailedProposalsData(activeIds);
      if (!!activeIds.length) {
        await Promise.all([
          await get().getIpfsData(activeIds),
          await get().getL1Balances(activeIds),
        ]);
      }
      set({ isInitialLoading: false });
      get().updatePaginatedProposalsData();
    } else {
      const paginatedIds = selectPaginatedIds(get());
      const { activeIds } = selectProposalIds(get(), paginatedIds);
      await get().getDetailedProposalsData(activeIds);
      await Promise.all([
        await get().getIpfsData(activeIds),
        await get().getL1Balances(activeIds),
      ]);
      get().updatePaginatedProposalsData();
    }
  },
  getPaginatedProposalsDataWithoutIpfs: async () => {
    const paginatedIds = selectPaginatedIds(get());
    const { activeIds } = selectProposalIds(get(), paginatedIds);
    await get().getDetailedProposalsData(activeIds);
    await get().getL1Balances(activeIds);
    get().updatePaginatedProposalsData();
  },
  updatePaginatedProposalsData: () => {
    const paginatedIds = selectPaginatedIds(get());
    const { activeIds, cachedIds } = selectProposalIds(get(), paginatedIds);

    set((state) =>
      produce(state, (draft) => {
        activeIds.forEach((id) => {
          const proposalData = draft.detailedProposalsData[id];
          if (proposalData) {
            draft.detailedProposalsData[id] = {
              ...proposalData,
              title: getProposalTitle(get(), id, proposalData.ipfsHash),
            };
          }
        });
        cachedIds.forEach((id) => {
          const proposalData = draft.detailedProposalsData[id];
          if (proposalData) {
            draft.detailedProposalsData[id] = {
              ...proposalData,
              title: getProposalTitle(get(), id, proposalData.ipfsHash),
              prerender: true,
            };
          }
        });
      }),
    );
  },
  getProposalDataWithIpfsById: async (id) => {
    await get().getDetailedProposalsData([id]);
    await Promise.all([
      await get().getIpfsData([id]),
      await get().getL1Balances([id]),
    ]);
    get().updatePaginatedProposalsData();
  },

  setGovCoreConfigs: async () => {
    if (!get().configs.length) {
      const { configs, contractsConstants } =
        await get().govDataService.getGovCoreConfigs(get().setRpcError);
      set({ configs, contractsConstants });
    }
  },
  setSSRGovCoreConfigs: (configs, contractsConstants) => {
    if (!get().configs.length) {
      set({ configs, contractsConstants });
    }
  },
  configs: [],
  contractsConstants: {
    precisionDivider: '',
    cooldownPeriod: 0,
    expirationTime: 0,
    cancellationFee: '',
  },

  detailedPayloadsData: {},
  setDetailedPayloadsData: (key, data) => {
    if (!get().detailedPayloadsData[key]) {
      set((state) =>
        produce(state, (draft) => {
          draft.detailedPayloadsData[key] = data;
        }),
      );
    }
  },
  getDetailedPayloadsData: async (chainId, payloadsController, ids) => {
    const payloadController =
      appConfig.payloadsControllerConfig[chainId].contractAddresses.some(
        (address) => address === payloadsController,
      ) && payloadsController;

    if (payloadController) {
      const rpcUrl = get().appClients[chainId].rpcUrl;

      try {
        const payloadsData = await get().govDataService.getPayloads(
          chainId,
          payloadsController,
          ids,
        );

        set((state) =>
          produce(state, (draft) => {
            payloadsData.forEach((payload) => {
              draft.detailedPayloadsData[
                `${payload.payloadsController}_${payload.id}`
              ] = payload;
            });
          }),
        );
        get().setRpcError({ isError: false, rpcUrl, chainId });
      } catch {
        get().setRpcError({ isError: true, rpcUrl, chainId });
      }
    }
  },

  ipfsData: {},
  ipfsDataErrors: {},
  setIpfsDataErrors: (ipfsHash, text) => {
    set((state) =>
      produce(state, (draft) => {
        draft.ipfsDataErrors[ipfsHash] = text || texts.other.fetchFromIpfsError;
      }),
    );
  },
  setIpfsData: (hash, data) => {
    if (!get().ipfsData[hash]) {
      set((state) =>
        produce(state, (draft) => {
          draft.ipfsData[hash] = data;
        }),
      );
    }
  },
  getIpfsData: async (ids, hash) => {
    const ipfsData = get().ipfsData;

    const newIpfsHashes: string[] = [];
    ids.forEach((id) => {
      const proposalData = get().detailedProposalsData[id];

      if (
        proposalData &&
        typeof ipfsData[proposalData.ipfsHash] === 'undefined'
      ) {
        newIpfsHashes.push(proposalData.ipfsHash);
      } else if (!proposalData && hash) {
        newIpfsHashes.push(hash);
      }
    });

    const filteredNewIpfsHashes = newIpfsHashes.filter(
      (value, index, self) => self.indexOf(value) === index,
    );

    const allIpfsData = await Promise.all(
      filteredNewIpfsHashes.map(async (hash) => {
        return await getProposalMetadata(
          hash,
          ipfsGateway,
          get().setIpfsDataErrors,
          texts.other.fetchFromIpfsIncorrectHash,
        );
      }),
    );

    set((state) =>
      produce(state, (draft) => {
        allIpfsData.forEach((ipfs, index) => {
          draft.ipfsData[filteredNewIpfsHashes[index]] = ipfs;
        });
        ids.forEach((id) => {
          const proposalData = draft.detailedProposalsData[id];
          if (proposalData) {
            draft.detailedProposalsData[id] = {
              ...proposalData,
              title: getProposalTitle(
                get(),
                id,
                proposalData.ipfsHash,
                draft.detailedProposalsData[id]?.title,
              ),
            };
          }
        });
      }),
    );
  },

  detailedProposalsData: {},
  detailedProposalsDataLoadings: {},
  setDetailedProposalsDataLoadings: (id) => {
    set((state) =>
      produce(state, (draft) => {
        draft.detailedProposalsDataLoadings[id] = true;
      }),
    );
  },
  detailedProposalsDataLoading: false,
  setDetailedProposalsData: (id, data) => {
    if (!get().detailedProposalsData[id]) {
      set({ detailedProposalsDataLoading: true });
      set((state) =>
        produce(state, (draft) => {
          draft.detailedProposalsData[id] = data as Draft<ProposalData>;
        }),
      );
      set({ detailedProposalsDataLoading: false });
    }
  },

  getDetailedProposalsData: async (ids, from, to, pageSize) => {
    const userAddress = get().activeWallet?.address;
    const representativeAddress = get().representative.address;

    set((state) =>
      produce(state, (draft) => {
        ids.forEach((id) => {
          draft.detailedProposalsDataLoadings[id] =
            typeof draft.detailedProposalsDataLoadings[id] !== 'undefined'
              ? draft.detailedProposalsDataLoadings[id]
              : true;
        });
      }),
    );

    if (!get().representativeLoading) {
      const isProposalNotInCache = !ids.filter(
        (proposalId) =>
          proposalId ===
          get().cachedProposalsIds.find((id) => proposalId === id),
      ).length;

      let proposalsData: BasicProposal[] = [];
      if (!!ids.length && isProposalNotInCache) {
        const fr = Math.max.apply(
          null,
          ids.map((id) => id),
        );

        const to = Math.min.apply(
          null,
          ids.map((id) => id),
        );

        proposalsData = await get().govDataService.getDetailedProposalsData(
          fr <= 0 ? (get().totalProposalCount > 9 ? 1 : 0) : fr,
          to <= 0 ? 0 : to,
          userAddress,
          representativeAddress as Hex,
          PAGE_SIZE,
          get().setRpcError,
        );
      } else if ((from || from === 0 || from === -1) && isProposalNotInCache) {
        proposalsData = await get().govDataService.getDetailedProposalsData(
          from < 0 ? 0 : from,
          0,
          userAddress,
          representativeAddress as Hex,
          pageSize,
          get().setRpcError,
        );
      } else if (from && from > 0 && to && to > 0 && isProposalNotInCache) {
        proposalsData = await get().govDataService.getDetailedProposalsData(
          from,
          to,
          userAddress,
          representativeAddress as Hex,
          PAGE_SIZE,
          get().setRpcError,
        );
      } else if (!isProposalNotInCache) {
        const proposals = ids.map((id) => get().detailedProposalsData[id]);
        proposalsData = await get().govDataService.getOnlyVotingMachineData(
          proposals,
          userAddress,
          representativeAddress as Hex,
          get().setRpcError,
        );
      }

      const payloadsChainIds = proposalsData
        .map((proposal) =>
          proposal.initialPayloads.map((payload) => payload.chainId),
        )
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index);

      const payloadsControllers = proposalsData
        .map((proposal) =>
          proposal.initialPayloads.map((payload) => payload.payloadsController),
        )
        .flat()
        .filter((value, index, self) => self.indexOf(value) === index);

      await Promise.all(
        payloadsChainIds.map(async (chainId) => {
          await Promise.all(
            payloadsControllers.map(async (controller) => {
              const payloadsIds = proposalsData
                .map((proposal) =>
                  proposal.initialPayloads.filter(
                    (payload) =>
                      payload.chainId === chainId &&
                      payload.payloadsController === controller,
                  ),
                )
                .flat()
                .map((payload) => payload.id);

              if (isProposalNotInCache) {
                await get().getDetailedPayloadsData(
                  chainId,
                  controller,
                  payloadsIds,
                );
              }
            }),
          );
        }),
      );

      const proposalPayloadsData = proposalsData.map((proposal) => {
        const payloads = proposal.initialPayloads.map((payload) => {
          return {
            ...get().detailedPayloadsData[
              `${payload.payloadsController}_${payload.id}`
            ],
            id: payload.id,
            chainId: payload.chainId,
            payloadsController: payload.payloadsController,
          };
        });

        return {
          proposalId: proposal.id,
          payloads,
        };
      });

      set((state) =>
        produce(state, (draft) => {
          proposalsData.forEach((proposal) => {
            draft.detailedProposalsData[proposal.id] = {
              ...proposal,
              prerender: !draft.detailedProposalsData[proposal.id]?.prerender
                ? proposal.prerender
                : !!draft.detailedProposalsData[proposal.id]?.prerender,
              votingMachineState: getVotingMachineProposalState(proposal),
              payloads: !!draft.detailedProposalsData[proposal.id]?.prerender
                ? draft.detailedProposalsData[proposal.id].payloads
                : proposalPayloadsData.filter(
                    (payload) => payload.proposalId === proposal.id,
                  )[0].payloads,
              title: getProposalTitle(
                get(),
                proposal.id,
                proposal.ipfsHash,
                draft.detailedProposalsData[proposal.id]?.title,
              ),
            } as Draft<ProposalData>;
          });
        }),
      );

      setTimeout(
        () =>
          set((state) =>
            produce(state, (draft) => {
              proposalsData.forEach((proposal) => {
                draft.detailedProposalsDataLoadings[proposal.id] = false;
              });
            }),
          ),
        1,
      );
    }
  },
  detailedProposalDataInterval: undefined,
  startDetailedProposalDataPolling: async (ids) => {
    const currentInterval = get().detailedProposalDataInterval;
    clearInterval(currentInterval);

    const interval = setInterval(async () => {
      const paginatedIds = selectPaginatedIds(get());
      const { activeIds } = selectProposalIds(get(), paginatedIds);

      const activeProposalsIds = !!ids?.length ? ids : activeIds;

      if (!!activeProposalsIds.length) {
        await get().getDetailedProposalsData(activeProposalsIds);
        await Promise.all([
          await get().getIpfsData(activeProposalsIds),
          await get().getL1Balances(activeProposalsIds),
        ]);
        get().updatePaginatedProposalsData();
      }
    }, 30000);

    set({ detailedProposalDataInterval: Number(interval) });
  },
  stopDetailedProposalDataPolling: () => {
    const interval = get().detailedProposalDataInterval;
    if (interval) {
      clearInterval(interval);
      set({ detailedProposalDataInterval: undefined });
    }
  },

  newProposalsInterval: undefined,
  startNewProposalsPolling: async () => {
    const currentInterval = get().newProposalsInterval;
    clearInterval(currentInterval);

    const interval = setInterval(async () => {
      const totalProposalCountFromContract =
        await get().govDataService.getTotalProposalsCount(
          get().totalProposalCount,
          get().setRpcError,
        );
      const currentProposalCount = get().totalProposalCount;

      if (totalProposalCountFromContract > currentProposalCount) {
        get().getDetailedProposalsData(
          [],
          currentProposalCount,
          currentProposalCount - 1,
        );
        get().setTotalProposalCount(totalProposalCountFromContract);
      }
    }, 15000);

    set({ newProposalsInterval: Number(interval) });
  },
  stopNewProposalsPolling: () => {
    const interval = get().newProposalsInterval;
    if (interval) {
      clearInterval(interval);
      set({ newProposalsInterval: undefined });
    }
  },

  blockHashBalance: {},
  blockHashBalanceLoadings: {},
  resetL1Balances: () => {
    set({ blockHashBalance: {} });
  },
  getL1Balances: async (ids) => {
    const activeAddress = get().activeWallet?.address;
    const blockHashes = get().blockHashBalance;

    const newBlockHashes: {
      hash: string;
      underlyingAssets: string[];
      votingChainId: number;
    }[] = [];

    if (activeAddress && !get().representativeLoading) {
      const userAddress = get().representative.address || activeAddress;

      ids.forEach((id) => {
        const proposalData = get().detailedProposalsData[id];
        if (
          proposalData &&
          !!proposalData.payloads.length &&
          !!get().configs.length &&
          get().contractsConstants.expirationTime > 0
        ) {
          const proposalConfig = selectConfigByAccessLevel(
            get(),
            proposalData.accessLevel,
          );

          const executionPayloadTime = Math.max.apply(
            null,
            proposalData.payloads.map((payload) => payload.delay),
          );

          const { isVotingActive } = getProposalStepsAndAmounts({
            proposalData,
            quorum: proposalConfig.quorum,
            differential: proposalConfig.differential,
            precisionDivider: get().contractsConstants.precisionDivider,
            cooldownPeriod: get().contractsConstants.cooldownPeriod,
            executionPayloadTime,
          });

          if (
            proposalData &&
            !!proposalData.votingMachineData.l1BlockHash &&
            isVotingActive &&
            typeof blockHashes[
              `${proposalData.votingMachineData.l1BlockHash}_${userAddress}`
            ] === 'undefined'
          ) {
            newBlockHashes.push({
              hash: proposalData.votingMachineData.l1BlockHash,
              underlyingAssets: proposalData.votingMachineData
                .votingAssets as Hex[],
              votingChainId: proposalData.votingChainId,
            });
          }
        }
      });

      set((state) =>
        produce(state, (draft) => {
          newBlockHashes.forEach((hash) => {
            draft.blockHashBalanceLoadings[`${hash.hash}_${userAddress}`] =
              true;
          });
        }),
      );

      const balances = await Promise.all(
        newBlockHashes.map((item) => {
          return get().delegationService.getDelegatedVotingPowerByBlockHash(
            item.hash as Hex,
            userAddress,
            item.underlyingAssets as Hex[],
          );
        }),
      );

      set((state) =>
        produce(state, (draft) => {
          balances.forEach((balance, index) => {
            draft.blockHashBalance[
              `${newBlockHashes[index].hash}_${userAddress}`
            ] = balance;
          });
        }),
      );

      setTimeout(
        () =>
          set((state) =>
            produce(state, (draft) => {
              balances.forEach((balance, index) => {
                draft.blockHashBalanceLoadings[
                  `${newBlockHashes[index].hash}_${userAddress}`
                ] = false;
              });
            }),
          ),
        1,
      );
    }
  },

  creatorBalance: {},
  getProposalCreatorBalance: async (creator, underlyingAssets) => {
    const creatorDelegatedPower =
      await get().delegationService.getDelegatedPropositionPower(
        underlyingAssets as Hex[],
        creator as Hex,
      );

    const creatorPropositionPower = creatorDelegatedPower.map((power) =>
      normalizeBN(power.delegationPropositionPower.toString(), 18).toNumber(),
    );

    const creatorBalance = creatorPropositionPower
      .map((balance) => valueToBigNumber(balance).toNumber())
      .reduce((sum, value) => sum + value, 0);

    set((state) =>
      produce(state, (draft) => {
        draft.creatorBalance[creator] = creatorBalance;
      }),
    );
  },

  voters: [],
  setVoters: (voters) => set({ voters }),
  getVoters: async (
    proposalId,
    votingChainId,
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
  ) => {
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

    const votersData = await get().govDataService.getVoters(
      votingChainId,
      startBlockNumber,
      endBlockNumber,
      lastBlockNumber,
    );
    const currentVotersData = get().voters;

    const newVotersData: VotersData[] = [];
    for (let i = 0; i < votersData.length; i++) {
      let found = false;
      for (let j = 0; j < currentVotersData.length; j++) {
        if (
          votersData[i].transactionHash === currentVotersData[j].transactionHash
        ) {
          found = true;
          break;
        }
      }

      if (!found) {
        const vote = votersData[i];

        if (vote.ensName) {
          newVotersData.push(vote);
        } else {
          if (ENSDataExists(get(), vote.address, ENSProperty.NAME)) {
            newVotersData.push({
              ...vote,
              ensName:
                get().ensData[vote.address.toLocaleLowerCase() as Hex].name,
            });
          } else {
            newVotersData.push(vote);
          }
        }
      }
    }

    if (newVotersData.length > 0) {
      set((state) =>
        produce(state, (draft) => {
          draft.voters = [...draft.voters, ...newVotersData];
        }),
      );

      const topVotersByProposalIdWithENS = await Promise.all(
        selectVotersByProposalId(get(), proposalId)
          .voters.sort((a, b) => b.votingPower - a.votingPower)
          .slice(0, 5)
          .map(async (vote) => {
            if (vote.ensName) {
              return vote;
            } else {
              await get().fetchEnsNameByAddress(vote.address);
              const ensName =
                get().ensData[vote.address.toLocaleLowerCase() as Hex].name;
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

      const newVotersDataWithENS: VotersData[] = [];
      for (let i = 0; i < topVotersByProposalIdWithENS.length; i++) {
        let found = false;
        let indexKey: number | undefined = undefined;
        for (let j = 0; j < get().voters.length; j++) {
          if (
            topVotersByProposalIdWithENS[i].transactionHash ===
              get().voters[j].transactionHash &&
            topVotersByProposalIdWithENS[i].ensName === get().voters[j].ensName
          ) {
            found = true;
            break;
          } else {
            indexKey = j;
          }
        }

        if (!found) {
          set((state) =>
            produce(state, (draft) => {
              if (typeof indexKey !== 'undefined') {
                draft.voters.splice(indexKey, 1);
              }
            }),
          );
          newVotersDataWithENS.push(topVotersByProposalIdWithENS[i]);
        }
      }

      if (newVotersDataWithENS.length > 0) {
        set((state) =>
          produce(state, (draft) => {
            draft.voters = [...draft.voters, ...newVotersDataWithENS];
          }),
        );
      }
    }
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
  startVotersPolling: async (
    proposalId,
    votingChainId,
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
  ) => {
    const currentInterval = get().getVotersInterval;
    clearInterval(currentInterval);

    const interval = setInterval(() => {
      get().getVoters(
        proposalId,
        votingChainId,
        startBlockNumber,
        endBlockNumber,
        lastBlockNumber,
      );
    }, 60000);

    set({ getVotersInterval: Number(interval) });
  },
  stopVotersPolling: () => {
    const interval = get().getVotersInterval;
    if (interval) {
      clearInterval(interval);
      set(() => ({ getVotersInterval: undefined }));
    }
  },

  supportObject: {},
  fullClearSupportObject: () => {
    set({ supportObject: {} });
  },
  clearSupportObject: (proposalId) => {
    set((state) =>
      produce(state, (draft) => {
        delete draft.supportObject[proposalId];
      }),
    );
  },
  setSupportObject: (proposalId, support) => {
    set((state) =>
      produce(state, (draft) => {
        draft.supportObject[proposalId] = support;
      }),
    );
  },

  activateVoting: async (proposalId) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.activateVoting(proposalId);
      },
      params: {
        type: 'activateVoting',
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  sendProofs: async (
    votingChainId,
    proposalId,
    asset,
    baseBalanceSlotRaw,
    withSlot,
  ) => {
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      const proposalData = get().detailedProposalsData[proposalId];

      if (checkHash(proposalData.snapshotBlockHash).notZero) {
        const block = await get().appClients[
          appConfig.govCoreChainId
        ].instance.getBlock({
          blockHash: proposalData.snapshotBlockHash as Hex,
        });

        await get().executeTx({
          // @ts-ignore
          body: () => {
            get().setModalOpen(true);
            return get().govDataService.sendProofs(
              activeAddress,
              Number(block.number),
              asset,
              votingChainId,
              baseBalanceSlotRaw,
              withSlot,
            );
          },
          params: {
            type: 'sendProofs',
            desiredChainID: votingChainId,
            payload: {
              proposalId,
              blockHash: proposalData.snapshotBlockHash,
              underlyingAsset: asset,
              withSlot,
            },
          },
        });
      }
    }
  },

  activateVotingOnVotingMachine: async (votingChainId, proposalId) => {
    const govDataService = get().govDataService;
    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.activateVotingOnVotingMachine(
          votingChainId,
          proposalId,
        );
      },
      params: {
        type: 'activateVotingOnVotingMachine',
        desiredChainID: votingChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  vote: async ({
    votingChainId,
    proposalId,
    support,
    gelato,
    balances,
    voterAddress,
  }) => {
    const activeAddress = get().activeWallet?.address;
    const proposal = get().detailedProposalsData[proposalId];
    const govDataService = get().govDataService;

    if (proposal && activeAddress) {
      if (balances && balances.length > 0) {
        const formattedBalances = formatBalances(balances);

        if (voterAddress) {
          const proofs = await getVotingProofs(
            proposal.snapshotBlockHash as Hex,
            formattedBalances,
            govDataService,
            voterAddress as Hex,
          );

          if (proofs && proofs.length > 0) {
            const proofOfRepresentative = await getProofOfRepresentative(
              proposal.votingMachineData.l1BlockHash,
              govDataService,
              voterAddress as Hex,
              votingChainId,
            );

            await get().executeTx({
              body: () => {
                get().setModalOpen(true);
                return gelato
                  ? govDataService.voteBySignature({
                      votingChainId,
                      proposalId,
                      support,
                      votingAssetsWithSlot:
                        getVotingAssetsWithSlot(formattedBalances),
                      proofs,
                      signerAddress: activeAddress,
                      voterAddress: voterAddress as Hex,
                      proofOfRepresentation: proofOfRepresentative,
                    })
                  : govDataService.vote({
                      votingChainId,
                      proposalId,
                      support,
                      proofs,
                      voterAddress: voterAddress as Hex,
                      proofOfRepresentation: proofOfRepresentative,
                    });
              },
              params: {
                type: 'vote',
                desiredChainID: votingChainId,
                payload: {
                  proposalId,
                  support,
                  voter: voterAddress,
                },
              },
            });
          }
        } else {
          const proofs = await getVotingProofs(
            proposal.votingMachineData.l1BlockHash,
            formattedBalances,
            govDataService,
            activeAddress,
          );

          if (proofs && proofs.length > 0) {
            await get().executeTx({
              body: () => {
                get().setModalOpen(true);
                return gelato
                  ? govDataService.voteBySignature({
                      votingChainId,
                      proposalId,
                      support,
                      votingAssetsWithSlot:
                        getVotingAssetsWithSlot(formattedBalances),
                      signerAddress: activeAddress,
                      proofs,
                    })
                  : govDataService.vote({
                      votingChainId,
                      proposalId,
                      support,
                      proofs,
                    });
              },
              params: {
                type: 'vote',
                desiredChainID: votingChainId,
                payload: {
                  proposalId,
                  support,
                  voter: activeAddress,
                },
              },
            });
          }
        }
      }
    }
  },

  closeAndSendVote: async (votingChainId, proposalId) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.closeAndSendVote(votingChainId, proposalId);
      },
      params: {
        type: 'closeAndSendVote',
        desiredChainID: votingChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  executeProposal: async (proposalId) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.executeProposal(proposalId);
      },
      params: {
        type: 'executeProposal',
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  executePayload: async (proposalId, payload) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.executePayload(
          payload.chainId,
          payload.id,
          payload.payloadsController,
        );
      },
      params: {
        type: 'executePayload',
        desiredChainID: payload.chainId,
        payload: {
          proposalId,
          payloadId: payload.id,
          chainId: payload.chainId,
        },
      },
    });
  },

  createPayload: async (
    chainId,
    payloadActions,
    payloadId,
    payloadsController,
  ) => {
    const govDataService = get().govDataService;

    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.createPayload(
          chainId,
          payloadActions,
          payloadsController as Hex,
        );
      },
      params: {
        type: 'createPayload',
        desiredChainID: chainId,
        payload: {
          chainId,
          payloadId,
          payloadsController,
        },
      },
    });
  },

  createProposal: async (votingPortalAddress, payloads, ipfsHash) => {
    const govDataService = get().govDataService;
    const proposalsCount = await govDataService.getTotalProposalsCount();

    const formattedPayloads = await Promise.all(
      payloads.map(async (payload) => {
        let formattedPayload =
          get().detailedPayloadsData[
            `${payload.payloadsController}_${payload.id}`
          ];

        if (!formattedPayload) {
          await get().getDetailedPayloadsData(
            payload.chainId,
            payload.payloadsController,
            [payload.id],
          );
          formattedPayload =
            get().detailedPayloadsData[
              `${payload.payloadsController}_${payload.id}`
            ];
        }

        return {
          chain: formattedPayload.chainId,
          id: formattedPayload.id,
          accessLevel: formattedPayload.maximumAccessLevelRequired,
          payloadsController: formattedPayload.payloadsController,
        };
      }),
    );

    const cancellationFee = get().contractsConstants.cancellationFee;

    if (!!cancellationFee) {
      await get().executeTx({
        body: () => {
          get().setModalOpen(true);
          return govDataService.createProposal(
            votingPortalAddress as Hex,
            formattedPayloads,
            ipfsHash as Hex,
            cancellationFee,
          );
        },
        params: {
          type: 'createProposal',
          desiredChainID: appConfig.govCoreChainId,
          payload: {
            proposalId: proposalsCount,
          },
        },
      });
    }
  },

  cancelProposal: async (proposalId) => {
    const govDataService = get().govDataService;
    await get().executeTx({
      body: () => {
        get().setModalOpen(true);
        return govDataService.cancelProposal(proposalId);
      },
      params: {
        type: 'cancelProposal',
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
        },
      },
    });
  },
});
