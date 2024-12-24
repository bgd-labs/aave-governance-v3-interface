import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { GetPayloadsData, PayloadFromServer } from '../types';
import { formatPayloadFromServer } from './utils/formatPayloadFromServer';
import { getPayloadsDataRPC } from './utils/getPayloadsDataRPC';

export async function fetchPayloads({ input }: { input: GetPayloadsData }) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      return await Promise.all(
        input.payloadsIds.map(async (id) => {
          const payloadsController =
            appConfig.payloadsControllerConfig[input.chainId]
              .contractAddresses[0];
          const url = `${INITIAL_API_URL}/payloads/getById/?payloadId=${id}&payloadChainId=${input.chainId}&payloadsController=${payloadsController}`;
          const dataRaw = await fetch(url);
          const data = (await dataRaw.json()) as PayloadFromServer;
          return formatPayloadFromServer(data);
        }),
      );
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error(
      'Error getting payloads data from API, using RPC fallback',
      e,
    );
    return await getPayloadsDataRPC({ ...input });
  }
}
