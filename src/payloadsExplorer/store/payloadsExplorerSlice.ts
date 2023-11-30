import { Payload, PayloadState } from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
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

  payloadsExploreData: PayloadsData;
  getPayloadsExploreData: (
    chainId: number,
    address: Hex,
    activePage?: number,
  ) => Promise<void>;
}

const pageSize = 15;

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

  payloadsExploreData: {},
  getPayloadsExploreData: async (chainId, address, activePage) => {
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

    if (totalPayloadsCount >= 1) {
      const payloadsIds = Array.from(Array(totalPayloadsCount).keys());
      const finishedIdsInStore = !!get().payloadsExploreData[chainId]
        ? Object.values(get().payloadsExploreData[chainId][address] || {})
            .filter((payload) => payload.state >= PayloadState.Executed)
            .map((payload) => payload.id)
        : [];

      const currentActiveIds: number[] = [];
      if (finishedIdsInStore.length > 0) {
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

      if (activePage || activePage === 0) {
        set((state) =>
          produce(state, (draft) => {
            draft.payloadsExplorePagination[address] = {
              ...draft.payloadsExplorePagination[address],
              activePage,
              currentIds: paginatedIds,
            };
          }),
        );
      }

      if (!!idsForRequest.length || !get().payloadsExplorePagination[address]) {
        const payloadsData: Payload[] = await get().govDataService.getPayloads(
          chainId,
          address,
          !get().payloadsExplorePagination[address]
            ? paginatedIds
            : idsForRequest,
        );

        const formattedPayloadsData: Record<string, Payload> = {};
        payloadsData.forEach((payload) => {
          if (payload) {
            formattedPayloadsData[
              `${payload.payloadsController}_${payload.id}`
            ] = payload;
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

      if (!get().payloadsExplorePagination[address]) {
        set((state) =>
          produce(state, (draft) => {
            draft.payloadsExplorePagination[address] = {
              pageCount:
                pageSize < totalPayloadsCount
                  ? Math.ceil(totalPayloadsCount / pageSize)
                  : 1,
              activePage: 0,
              currentIds: paginatedIds,
            };
          }),
        );
      }
    } else {
      if (!get().payloadsExplorePagination[address]) {
        set((state) =>
          produce(state, (draft) => {
            draft.payloadsExplorePagination[address] = {
              pageCount: 1,
              activePage: 0,
              currentIds: [],
            };
          }),
        );
      }
    }
  },
});
