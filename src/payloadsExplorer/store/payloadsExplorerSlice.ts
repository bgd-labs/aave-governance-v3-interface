import { Payload } from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Hex } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';

type PayloadsData = Record<number, Record<Hex, Payload[]>>;
export interface IPayloadsExplorerSlice {
  totalPayloadsCountByAddress: Record<Hex, number>;
  payloadsExplorePagination: Record<
    Hex,
    { currentIteration: number; currentStepSize: number; isEnd?: boolean }
  >;

  payloadsExploreData: PayloadsData;
  getPayloadsExploreData: (chainId: number) => Promise<void>;

  getPaginatedPayloadsExploreData: (
    chainId: number,
    address: Hex,
  ) => Promise<void>;
}

const step = 16;
const initialSize = 48;

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

  getPaginatedPayloadsExploreData: async (chainId, address) => {
    const data = get().payloadsExplorePagination[address];
    if (data) {
      const { currentIteration, isEnd } = data;

      if (!isEnd) {
        set((state) =>
          produce(state, (draft) => {
            draft.payloadsExplorePagination[address] = {
              currentIteration: currentIteration + 1,
              currentStepSize: (currentIteration + 1) * step,
              isEnd:
                (currentIteration + 1) * step >=
                get().totalPayloadsCountByAddress[address],
            };
          }),
        );

        await get().getPayloadsExploreData(chainId);
      }
    }
  },

  payloadsExploreData: {},
  getPayloadsExploreData: async (chainId) => {
    await Promise.all(
      appConfig.payloadsControllerConfig[chainId].contractAddresses.map(
        async (address) => {
          const size =
            get().payloadsExplorePagination[address]?.currentStepSize === step
              ? 0
              : get().payloadsExplorePagination[address]?.currentStepSize || 0;
          const initialCount = get().totalPayloadsCountByAddress[address];

          const totalPayloadsCount = initialCount
            ? initialCount
            : await get().govDataService.getTotalPayloadsCount(
                address,
                chainId,
                get().setRpcError,
              );

          const sliceValue =
            size > 0
              ? size < totalPayloadsCount
                ? size
                : totalPayloadsCount
              : initialSize < totalPayloadsCount
                ? initialSize
                : totalPayloadsCount;

          set((state) =>
            produce(state, (draft) => {
              draft.totalPayloadsCountByAddress[address] = totalPayloadsCount;
              if (draft.payloadsExplorePagination[address]) {
                draft.payloadsExplorePagination[address].isEnd =
                  sliceValue >= totalPayloadsCount;
              }
            }),
          );

          if (totalPayloadsCount >= 1) {
            const payloadsIds = Array.from(Array(totalPayloadsCount).keys());
            const paginatedIds = payloadsIds
              .slice(-sliceValue)
              .sort((a, b) => b - a);

            const payloadsData: Payload[] =
              size > 0 && size <= initialSize
                ? get().payloadsExploreData[chainId][address]
                : await get().govDataService.getPayloads(
                    chainId,
                    address,
                    paginatedIds,
                  );

            set((state) =>
              produce(state, (draft) => {
                draft.payloadsExploreData[chainId] = {
                  [address]: payloadsData,
                };
              }),
            );

            if (!get().payloadsExplorePagination[address]) {
              set((state) =>
                produce(state, (draft) => {
                  draft.payloadsExplorePagination[address] = {
                    currentIteration: 1,
                    currentStepSize: step,
                    isEnd: step >= get().totalPayloadsCountByAddress[address],
                  };
                }),
              );
            }
          }
        },
      ),
    );
  },
});
