import {
  getBlockNumberByTimestamp,
  Payload,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Hex } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { PayloadParams } from '../types';

export type NewPayload = Payload & {
  seatbeltMD?: string;
  creator?: Hex;
  transactionHash?: string;
};

export interface ICreateByParamsSlice {
  createPayloadsData: Record<number, NewPayload[]>;
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

    const updatedPayloadsData: NewPayload[] = await Promise.all(
      Object.values(formattedPayloadsData).map(async (payload) => {
        try {
          const { minBlockNumber, maxBlockNumber } =
            await getBlockNumberByTimestamp({
              chainId: payload.chainId,
              targetTimestamp: payload.createdAt,
              client: get().appClients[payload.chainId].instance,
            });
          const events = await get().govDataService.getPayloadsCreatedEvents(
            payload.chainId,
            payload.payloadsController as Hex,
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
            creator: eventItem.creator,
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
            creator: undefined,
            transactionHash: undefined,
            ...payload,
          } as NewPayload;
        }
      }),
    );

    const updatedPayloadsWithReports = await Promise.all(
      updatedPayloadsData.map(async (payload) => {
        const preLink =
          'https://raw.githubusercontent.com/bgd-labs/seatbelt-gov-v3/main/reports/payloads';

        try {
          const response = await fetch(
            `${preLink}/${payload.chainId}/${payload.payloadsController}/${payload.id}.md`,
          );

          if (response.ok) {
            const reportMD: string = await response.text();

            return {
              seatbeltMD: reportMD,
              ...payload,
            } as NewPayload;
          } else {
            return {
              seatbeltMD: undefined,
              ...payload,
            } as NewPayload;
          }
        } catch {
          return {
            seatbeltMD: undefined,
            ...payload,
          } as NewPayload;
        }
      }),
    );

    set((state) =>
      produce(state, (draft) => {
        draft.createPayloadsData[proposalId] = updatedPayloadsWithReports;
      }),
    );
  },
});
