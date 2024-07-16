import {
  CreationFee,
  CreationFeeState,
  ProposalState,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Address } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import {
  TransactionsSlice,
  TxType,
} from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import {
  cachedCreationFeesPath,
  githubStartUrl,
} from '../../utils/cacheGithubLinks';
import { selectCreationFeesDataByCreator } from './creationFeesSelectors';
import { IWeb3Slice } from './web3Slice';

export interface ICreationFeesSlice {
  creationFeesProposalsCountOnRequest: number;
  creationFeesData: Record<Address, Record<number, CreationFee>>;
  getCreationFeesData: () => Promise<void>;
  updateCreationFeesDataByCreator: (
    creator: Address,
    ids?: number[],
  ) => Promise<void>;

  dataByCreatorLength: Record<Address, number>;
  setDataByCreatorLength: (creator: Address, length: number) => void;

  redeemCancellationFee: (
    creator: Address,
    proposalIds: number[],
  ) => Promise<void>;
}

export const creationFeesSlice: StoreSlice<
  ICreationFeesSlice,
  IWeb3Slice &
    IProposalsSlice &
    IRpcSwitcherSlice &
    TransactionsSlice &
    IUISlice
> = (set, get) => ({
  creationFeesProposalsCountOnRequest: -1,

  creationFeesData: {},
  getCreationFeesData: async () => {
    const creationFeesResponse = await fetch(
      `${githubStartUrl}/${cachedCreationFeesPath}`,
    );

    if (creationFeesResponse.ok) {
      const creationFeesData = (await creationFeesResponse.json()) as {
        data: Record<Address, Record<number, CreationFee>>;
      };

      const count =
        get().totalProposalCount > 0
          ? get().totalProposalCount
          : await get().govDataService.getTotalProposalsCount();

      set((state) =>
        produce(state, (draft) => {
          draft.creationFeesProposalsCountOnRequest = count;
          draft.creationFeesData = {
            ...creationFeesData.data,
            ...draft.creationFeesData,
          };
        }),
      );
    }
  },

  updateCreationFeesDataByCreator: async (creator, ids) => {
    const govCoreConfigs = get().configs.length
      ? {
          contractsConstants: get().contractsConstants,
          configs: get().configs,
        }
      : await get().govDataService.getGovCoreConfigs();

    const totalProposalCount =
      get().totalProposalCount > 0
        ? get().totalProposalCount
        : await get().govDataService.getTotalProposalsCount();

    const creatorData = selectCreationFeesDataByCreator(get(), creator);

    if (creatorData) {
      const filteredData = Object.values(creatorData)
        .filter((data) => data.status < CreationFeeState.RETURNED)
        .filter((data) => (ids ? ids.includes(data.proposalId) : true));

      const from = Math.max(...filteredData.map((data) => data.proposalId));
      const to = Math.min(...filteredData.map((data) => data.proposalId));

      const proposalsData = await get().govDataService.getDetailedProposalsData(
        govCoreConfigs.configs,
        from,
        to,
        undefined,
        undefined,
        totalProposalCount,
        get().setRpcError,
      );

      const finalData = await Promise.all(
        filteredData.map(async (data) => {
          const proposal = proposalsData.find(
            (proposal) => proposal.id === data.proposalId,
          );

          if (proposal) {
            let status = CreationFeeState.LATER;
            if (proposal.state === ProposalState.Cancelled) {
              status = CreationFeeState.NOT_AVAILABLE;
            } else if (
              proposal.state >= ProposalState.Executed &&
              proposal.cancellationFee > 0
            ) {
              status = CreationFeeState.AVAILABLE;
            } else if (
              proposal.state >= ProposalState.Executed &&
              proposal.cancellationFee <= 0
            ) {
              status = CreationFeeState.RETURNED;
            }

            return {
              ...data,
              status,
            };
          }
        }),
      );

      finalData.forEach((data) => {
        if (data) {
          set((state) =>
            produce(state, (draft) => {
              draft.creationFeesData[creator] = {
                ...draft.creationFeesData[creator],
                [data.proposalId]: {
                  ...data,
                },
              };
            }),
          );
        }
      });
    }
  },

  dataByCreatorLength: {},
  setDataByCreatorLength: (creator, length) => {
    if (get().dataByCreatorLength[creator] !== length) {
      set((state) =>
        produce(state, (draft) => {
          draft.dataByCreatorLength[creator] = length;
        }),
      );
    }
  },

  redeemCancellationFee: async (creator, proposalIds) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const govDataService = get().govDataService;
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      await get().executeTx({
        body: () => {
          get().setModalOpen(true);
          return govDataService.redeemCancellationFee(proposalIds);
        },
        params: {
          type: TxType.claimFees,
          desiredChainID: appConfig.govCoreChainId,
          payload: { creator, proposalIds },
        },
      });
    }
  },
});
