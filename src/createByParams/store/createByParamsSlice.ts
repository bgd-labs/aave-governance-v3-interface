import { Payload } from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { PayloadParams } from '../types';

export interface ICreateByParamsSlice {
  createPayloadsData: Record<number, Payload[]>;
  createPayloadsErrors: Record<string, boolean>;
  getCreatePayloadsData: (
    proposalId: number,
    initialPayloadsData: PayloadParams[],
  ) => Promise<void>;
}

export const createByParamsSlice: StoreSlice<
  ICreateByParamsSlice,
  IWeb3Slice &
    TransactionsSlice &
    IProposalsSlice &
    IUISlice &
    IEnsSlice &
    IRpcSwitcherSlice
> = (set, get) => ({
  createPayloadsData: {},
  createPayloadsErrors: {},
  getCreatePayloadsData: async (proposalId, initialPayloadsData) => {
    const payloadsChainIds = initialPayloadsData.map(
      (payload) => payload.chainId,
    );
    const payloadsControllers = initialPayloadsData.map(
      (payload) => payload.payloadsController,
    );

    const formattedPayloadsData: Record<string, Payload> = {};
    const payloadsData = await Promise.all(
      payloadsChainIds.map(async (chainId) => {
        return await Promise.all(
          payloadsControllers.map(async (controller) => {
            const payloadsIds = initialPayloadsData
              .filter(
                (payload) =>
                  payload.chainId === chainId &&
                  payload.payloadsController === controller,
              )
              .map((payload) => payload.payloadId);

            try {
              return await get().govDataService.getPayloads(
                Number(chainId),
                controller,
                payloadsIds,
              );
            } catch {
              set((state) =>
                produce(state, (draft) => {
                  draft.createPayloadsErrors[controller] = true;
                }),
              );
              return [];
            }
          }),
        );
      }),
    );

    payloadsData
      .flat()
      .flat()
      .forEach((payload) => {
        formattedPayloadsData[`${payload.payloadsController}_${payload.id}`] =
          payload;
      });

    set((state) =>
      produce(state, (draft) => {
        draft.createPayloadsData[proposalId] = Object.values(
          formattedPayloadsData,
        );
      }),
    );
  },
});
