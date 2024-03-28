import {
  getBlockNumberByTimestamp,
  Payload,
  PayloadState,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { Draft, produce } from 'immer';
import { Address } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { IPayloadsHelperSlice } from '../../store/payloadsHelperSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { PayloadParams } from '../types';

export type NewPayload = Payload & {
  seatbeltMD?: string;
  creator?: Address;
  transactionHash?: string;
};

export interface IProposalCreateOverviewSlice {
  createPayloadsData: Record<string, NewPayload>;
  createPayloadsErrors: Record<string, boolean>;

  setCreatePayloadsData: (payloadsData: Record<string, NewPayload>) => void;
  getCreatePayloadsData: (
    proposalId: number,
    initialPayloadsData: PayloadParams[],
  ) => Promise<void>;
}

export const createProposalCreateOverviewSlice: StoreSlice<
  IProposalCreateOverviewSlice,
  IWeb3Slice &
    TransactionsSlice &
    IProposalsSlice &
    IUISlice &
    IEnsSlice &
    IRpcSwitcherSlice &
    IPayloadsHelperSlice
> = (set, get) => ({
  createPayloadsData: {},
  createPayloadsErrors: {},

  setCreatePayloadsData: (payloadsData) => {
    Object.values(payloadsData).forEach((payload) => {
      set((state) =>
        produce(state, (draft) => {
          const oldData =
            draft.createPayloadsData[
              `${payload.payloadsController}_${payload.id}`
            ];

          draft.createPayloadsData[
            `${payload.payloadsController}_${payload.id}`
          ] = {
            ...oldData,
            ...payload,
          } as Draft<Payload>;
        }),
      );
    });
  },

  getCreatePayloadsData: async (proposalId, initialPayloadsData) => {
    const payloadsChainIds = initialPayloadsData.map(
      (payload) => payload.chainId,
    );
    const payloadsControllers = initialPayloadsData.map(
      (payload) => payload.payloadsController,
    );

    const initialData = initialPayloadsData.map((payload) => {
      const data =
        get().createPayloadsData[
          `${payload.payloadsController}_${payload.payloadId}`
        ];

      if (data) {
        return data;
      } else {
        return undefined;
      }
    });

    const formattedPayloadsData: Record<string, NewPayload> = {};
    initialData.forEach((payload) => {
      if (payload) {
        formattedPayloadsData[`${payload.payloadsController}_${payload.id}`] =
          payload;
      }
    });

    if (!initialData.every((payload) => payload && payload?.id >= 0)) {
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
                    draft.createPayloadsErrors[`${controller}_${proposalId}`] =
                      true;
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
      get().setCreatePayloadsData(formattedPayloadsData);
    }

    if (
      initialData.some(
        (payload) => (payload && !payload?.transactionHash) || !payload,
      )
    ) {
      const updatedPayloadsData: NewPayload[] = await Promise.all(
        Object.values(formattedPayloadsData).map(async (payload) => {
          if (
            !payload.transactionHash &&
            payload.state < PayloadState.Executed
          ) {
            try {
              const { minBlockNumber, maxBlockNumber } =
                await getBlockNumberByTimestamp({
                  chainId: payload.chainId,
                  targetTimestamp: payload.createdAt,
                  client: get().appClients[payload.chainId].instance,
                });
              const events =
                await get().govDataService.getPayloadsCreatedEvents(
                  payload.chainId,
                  payload.payloadsController as Address,
                  minBlockNumber,
                  maxBlockNumber,
                );

              get().setRpcError({
                isError: false,
                rpcUrl: get().appClients[payload.chainId].rpcUrl,
                chainId: payload.chainId,
              });

              const eventItem = events.filter(
                (event) =>
                  event.chainId === payload.chainId &&
                  event.payloadId === payload.id &&
                  event.payloadsController === payload.payloadsController,
              )[0];

              return {
                transactionHash: eventItem.transactionHash,
                ...payload,
              } as NewPayload;
            } catch {
              get().setRpcError({
                isError: true,
                rpcUrl: get().appClients[payload.chainId].rpcUrl,
                chainId: payload.chainId,
              });

              return {
                transactionHash: undefined,
                ...payload,
              } as NewPayload;
            }
          } else {
            return payload;
          }
        }),
      );

      updatedPayloadsData.forEach((payload) => {
        formattedPayloadsData[`${payload.payloadsController}_${payload.id}`] =
          payload;
      });
      get().setCreatePayloadsData(formattedPayloadsData);
    }
  },
});
