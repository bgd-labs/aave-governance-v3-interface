import { Payload, PayloadState } from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { Draft, produce } from 'immer';
import { Hex } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';

type PayloadsData = Record<number, Record<Hex, Record<string, Payload>>>;
export interface IPayloadsExplorerSlice {
  totalPayloadsCountByAddress: Record<Hex, number>;
  setPayloadsExploreActivePage: (
    value: number,
    chainId: number,
    address: Hex,
  ) => Promise<void>;
  payloadsExplorePagination: Record<
    Hex,
    { activePage: number; pageCount: number; currentIds: number[] }
  >;

  setPaginationDetails: (
    chainId: number,
    address: Hex,
    activePage?: number,
  ) => Promise<{
    totalPayloadsCount: number;
    idsForRequest: number[];
  }>;

  payloadsExploreData: PayloadsData;
  getPayloadsExploreData: (
    chainId: number,
    address: Hex,
    activePage?: number,
  ) => Promise<void>;
  getPayloadsExploreDataById: (
    chainId: number,
    address: Hex,
    payloadId: number,
  ) => Promise<void>;

  isPayloadExplorerItemDetailsModalOpen: boolean;
  setIsPayloadExplorerItemDetailsModalOpen: (value: boolean) => void;

  detailedPayloadsExplorerDataInterval: number | undefined;
  startDetailedPayloadsExplorerDataPolling: (
    chainId: number,
    address: Hex,
    activePage?: number,
  ) => Promise<void>;
  stopDetailedPayloadsExplorerDataPolling: () => void;
}

const pageSize = 12;

export const createPayloadsExplorerSlice: StoreSlice<
  IPayloadsExplorerSlice,
  IWeb3Slice &
    TransactionsSlice &
    IProposalsSlice &
    IUISlice &
    IEnsSlice &
    IRpcSwitcherSlice
> = (set, get) => ({
  totalPayloadsCountByAddress: {},
  payloadsExplorePagination: {},

  setPayloadsExploreActivePage: async (value, chainId, address) => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    const data = get().payloadsExplorePagination[address];
    const totalPayloadsCount = get().totalPayloadsCountByAddress[address];

    if (data && totalPayloadsCount > 0 && value <= data.pageCount) {
      await get().getPayloadsExploreData(chainId, address, value);
    } else if (!data) {
      set((state) =>
        produce(state, (draft) => {
          draft.payloadsExplorePagination[address] = {
            pageCount:
              pageSize < totalPayloadsCount
                ? Math.ceil(totalPayloadsCount / pageSize)
                : 0,
            activePage: value,
            currentIds: [],
          };
        }),
      );
    }
  },

  setPaginationDetails: async (chainId, address, activePage) => {
    const initialCount = get().totalPayloadsCountByAddress[address];
    const totalPayloadsCount = initialCount
      ? initialCount
      : await get().govDataService.getTotalPayloadsCount(
          address,
          chainId,
          get().setRpcError,
        );

    set((state) =>
      produce(state, (draft) => {
        draft.totalPayloadsCountByAddress[address] = totalPayloadsCount;
      }),
    );

    const payloadsIds = Array.from(Array(totalPayloadsCount).keys());
    const finishedIdsInStore = !!get().payloadsExploreData[chainId]
      ? Object.values(get().payloadsExploreData[chainId][address] || {})
          .filter((payload) => payload.state >= PayloadState.Executed)
          .map((payload) => payload.id)
      : [];

    const currentActiveIds: number[] = [];
    for (let i = 0; i < payloadsIds.length; i++) {
      let found = false;
      for (let j = 0; j < finishedIdsInStore.length; j++) {
        if (payloadsIds[i] === finishedIdsInStore[j]) {
          found = true;
          break;
        }
      }
      if (!found) {
        currentActiveIds.push(payloadsIds[i]);
      }
    }

    const currentPage = activePage || 0;
    const size = totalPayloadsCount - currentPage * pageSize;
    const from = size > totalPayloadsCount ? totalPayloadsCount : size;

    const paginatedIds = Array.from(Array(from).keys()).filter(
      (id) => id >= from - pageSize && id <= totalPayloadsCount - 1,
    );

    const idsForRequest: number[] = [];
    for (let i = 0; i < paginatedIds.length; i++) {
      let found = false;
      for (let j = 0; j < currentActiveIds.length; j++) {
        if (paginatedIds[i] === currentActiveIds[j]) {
          found = true;
          break;
        }
      }
      if (found) {
        idsForRequest.push(paginatedIds[i]);
      }
    }

    set((state) =>
      produce(state, (draft) => {
        draft.payloadsExplorePagination[address] = {
          pageCount:
            pageSize < totalPayloadsCount
              ? Math.ceil(totalPayloadsCount / pageSize)
              : 1,
          activePage: activePage || 0,
          currentIds: paginatedIds,
        };
      }),
    );

    return {
      totalPayloadsCount,
      idsForRequest,
    };
  },

  payloadsExploreData: {},
  getPayloadsExploreData: async (chainId, address, activePage) => {
    const { totalPayloadsCount, idsForRequest } =
      await get().setPaginationDetails(chainId, address, activePage);

    if (totalPayloadsCount >= 1) {
      if (!!idsForRequest.length) {
        const payloadsData: Payload[] = await get().govDataService.getPayloads(
          chainId,
          address,
          idsForRequest,
        );

        const formattedPayloadsData: Record<string, Draft<Payload>> = {};
        payloadsData.forEach((payload) => {
          if (payload) {
            formattedPayloadsData[
              `${payload.payloadsController}_${payload.id}`
            ] = payload as Draft<Payload>;
          }
        });

        set((state) =>
          produce(state, (draft) => {
            draft.payloadsExploreData[chainId] = {
              [address]: {
                ...(draft.payloadsExploreData[chainId]
                  ? draft.payloadsExploreData[chainId][address]
                  : {}),
                ...formattedPayloadsData,
              },
            };
          }),
        );
      }
    }
  },
  getPayloadsExploreDataById: async (chainId, address, payloadId) => {
    await get().setPaginationDetails(chainId, address);

    const payloadsData: Payload[] = await get().govDataService.getPayloads(
      chainId,
      address,
      [payloadId],
    );

    const formattedPayloadsData: Record<string, Draft<Payload>> = {};
    payloadsData.forEach((payload) => {
      if (payload) {
        formattedPayloadsData[`${payload.payloadsController}_${payload.id}`] =
          payload as Draft<Payload>;
      }
    });

    set((state) =>
      produce(state, (draft) => {
        draft.payloadsExploreData[chainId] = {
          [address]: {
            ...(draft.payloadsExploreData[chainId]
              ? draft.payloadsExploreData[chainId][address]
              : {}),
            ...formattedPayloadsData,
          },
        };
      }),
    );
  },

  isPayloadExplorerItemDetailsModalOpen: false,
  setIsPayloadExplorerItemDetailsModalOpen: (value) => {
    set({ isModalOpen: value, isPayloadExplorerItemDetailsModalOpen: value });
  },

  detailedPayloadsExplorerDataInterval: undefined,
  startDetailedPayloadsExplorerDataPolling: async (
    chainId,
    address,
    activePage,
  ) => {
    const currentInterval = get().detailedProposalDataInterval;
    clearInterval(currentInterval);

    const interval = setInterval(async () => {
      await get().getPayloadsExploreData(chainId, address, activePage);
    }, 10000);

    set({ detailedPayloadsExplorerDataInterval: Number(interval) });
  },
  stopDetailedPayloadsExplorerDataPolling: () => {
    const interval = get().detailedPayloadsExplorerDataInterval;
    if (interval) {
      clearInterval(interval);
      set({ detailedPayloadsExplorerDataInterval: undefined });
    }
  },
});
