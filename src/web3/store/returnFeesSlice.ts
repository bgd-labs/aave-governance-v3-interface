import {
  ProposalState,
  ReturnFee,
  ReturnFeeState,
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
  cachedReturnFeesPath,
  githubStartUrl,
} from '../../utils/cacheGithubLinks';
import { selectReturnsFeesDataByCreator } from './returnFeesSelectors';
import { IWeb3Slice } from './web3Slice';

export interface IReturnFeesSlice {
  returnFeesProposalsCountOnRequest: number;
  returnFeesData: Record<Address, Record<number, ReturnFee>>;
  getReturnFeesData: () => Promise<void>;
  updateReturnFeesDataByCreator: (
    creator: Address,
    ids?: number[],
  ) => Promise<void>;

  dataByCreatorLength: Record<Address, number>;
  setDataByCreatorLength: (creator: Address, length: number) => void;

  returnFees: (creator: Address, proposalIds: number[]) => Promise<void>;
}

export const createReturnFeesSlice: StoreSlice<
  IReturnFeesSlice,
  IWeb3Slice &
    IProposalsSlice &
    IRpcSwitcherSlice &
    TransactionsSlice &
    IUISlice
> = (set, get) => ({
  returnFeesProposalsCountOnRequest: -1,

  returnFeesData: {},
  getReturnFeesData: async () => {
    const returnFeesResult = await fetch(
      `${githubStartUrl}/${cachedReturnFeesPath}`,
    );

    if (returnFeesResult.ok) {
      const returnFeesData = (await returnFeesResult.json()) as {
        data: Record<Address, Record<number, ReturnFee>>;
      };

      const count =
        get().totalProposalCount > 0
          ? get().totalProposalCount
          : await get().govDataService.getTotalProposalsCount();

      set((state) =>
        produce(state, (draft) => {
          draft.returnFeesProposalsCountOnRequest = count;
          draft.returnFeesData = {
            ...returnFeesData.data,
            ...draft.returnFeesData,
          };
        }),
      );
    }
  },

  updateReturnFeesDataByCreator: async (creator, ids) => {
    const govCoreConfigs = !!get().configs.length
      ? {
          contractsConstants: get().contractsConstants,
          configs: get().configs,
        }
      : await get().govDataService.getGovCoreConfigs();

    const totalProposalCount =
      get().totalProposalCount > 0
        ? get().totalProposalCount
        : await get().govDataService.getTotalProposalsCount();

    const creatorReturnFeesData = selectReturnsFeesDataByCreator(
      get(),
      creator,
    );

    if (creatorReturnFeesData) {
      const filteredData = Object.values(creatorReturnFeesData)
        .filter((data) => data.status < ReturnFeeState.RETURNED)
        .filter((data) => (!!ids ? ids.includes(data.proposalId) : true));

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
            let status = ReturnFeeState.LATER;
            if (proposal.state === ProposalState.Cancelled) {
              status = ReturnFeeState.NOT_AVAILABLE;
            } else if (
              proposal.state >= ProposalState.Executed &&
              proposal.cancellationFee > 0
            ) {
              status = ReturnFeeState.AVAILABLE;
            } else if (
              proposal.state >= ProposalState.Executed &&
              proposal.cancellationFee <= 0
            ) {
              status = ReturnFeeState.RETURNED;
            }

            return {
              ...data,
              status,
            };
          }
        }),
      );

      finalData.forEach((data) => {
        if (!!data) {
          set((state) =>
            produce(state, (draft) => {
              draft.returnFeesData[creator] = {
                ...draft.returnFeesData[creator],
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

  returnFees: async (creator, proposalIds) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const govDataService = get().govDataService;
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      await get().executeTx({
        body: () => {
          get().setModalOpen(true);
          return govDataService.returnFees(proposalIds);
        },
        params: {
          type: TxType.returnFees,
          desiredChainID: appConfig.govCoreChainId,
          payload: { creator, proposalIds },
        },
      });
    }
  },
});
