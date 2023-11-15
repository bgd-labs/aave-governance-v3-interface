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
export interface IPayloadsExplorerSliceSlice {
  payloadsExploreData: PayloadsData;
  getPayloadsExploreData: (chainId: number) => Promise<void>;
}

export const createPayloadsExplorerSlice: StoreSlice<
  IPayloadsExplorerSliceSlice,
  IWeb3Slice &
    TransactionsSlice &
    IProposalsSlice &
    IUISlice &
    IEnsSlice &
    IRpcSwitcherSlice
> = (set, get) => ({
  payloadsExploreData: {},
  getPayloadsExploreData: async (chainId) => {
    await Promise.all(
      appConfig.payloadsControllerConfig[chainId].contractAddresses.map(
        async (address) => {
          const totalPayloadsCount =
            await get().govDataService.getTotalPayloadsCount(
              address,
              chainId,
              get().setRpcError,
            );

          if (totalPayloadsCount >= 1) {
            const payloadsIds = Array.from(
              Array(totalPayloadsCount).keys(),
            ).sort((a, b) => b - a);

            const payloadsData: Payload[] =
              await get().govDataService.getPayloads(
                chainId,
                address,
                payloadsIds,
              );

            set((state) =>
              produce(state, (draft) => {
                draft.payloadsExploreData[chainId] = {
                  [address]: payloadsData,
                };
              }),
            );
          }
        },
      ),
    );
  },
});
