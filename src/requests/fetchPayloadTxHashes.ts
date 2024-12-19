import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { Address, zeroHash } from 'viem';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { getBlockNumberByTimestamp } from '../helpers/getBlockNumberByTimestamp';
import { InitialPayloadState, PayloadFromServer } from '../types';
import {
  getPayloadsCreated,
  getPayloadsExecuted,
  getPayloadsQueued,
} from './utils/getProposalEventsRPC';

export type FetchPayloadsTxHashes = {
  payloadId: number;
  chainId: number;
  payloadsController: string;
  timestamp: number;
  state:
    | InitialPayloadState.Created
    | InitialPayloadState.Queued
    | InitialPayloadState.Executed;
  clients: ClientsRecord;
};

export async function fetchPayloadTxHashes({
  input,
}: {
  input: FetchPayloadsTxHashes;
}) {
  const { payloadId, chainId, payloadsController, timestamp, state, clients } =
    input;

  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const url = `${INITIAL_API_URL}/payloads/getById/?payloadId=${payloadId}&payloadChainId=${chainId}&payloadsController=${payloadsController}`;
      const dataRaw = await fetch(url);
      const data = (await dataRaw.json()) as PayloadFromServer[];
      return [
        { transactionHash: data[0].createdTxHash ?? zeroHash },
        { transactionHash: data[0].queuedTxHash ?? zeroHash },
        { transactionHash: data[0].executedTxHash ?? zeroHash },
      ];
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error(
      'Error getting payload tx hashes from API, using RPC fallback',
      e,
    );

    const { minBlockNumber, maxBlockNumber } = await getBlockNumberByTimestamp({
      chainId,
      targetTimestamp: timestamp,
      client: clients[chainId],
    });

    const input = {
      contractAddress: payloadsController as Address,
      client: clients[chainId],
      startBlock: minBlockNumber,
      endBlock: maxBlockNumber,
      chainId,
    };

    let events: {
      payloadId?: number;
      chainId: number;
      transactionHash: string;
    }[] = [];

    if (state === InitialPayloadState.Created) {
      events = await getPayloadsCreated(input);
    } else if (state === InitialPayloadState.Queued) {
      events = await getPayloadsQueued(input);
    } else if (state === InitialPayloadState.Executed) {
      events = await getPayloadsExecuted(input);
    }

    const txHash = events
      .filter(
        (payload) =>
          payload.payloadId === payloadId && payload.chainId === chainId,
      )
      .map((event) => {
        return event.transactionHash;
      })[0];

    return [
      {
        transactionHash:
          state === InitialPayloadState.Created ? txHash : zeroHash,
      },
      {
        transactionHash:
          state === InitialPayloadState.Queued ? txHash : zeroHash,
      },
      {
        transactionHash:
          state === InitialPayloadState.Executed ? txHash : zeroHash,
      },
    ];
  }
}
