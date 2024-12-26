import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { PayloadFromServer } from '../server/api/types';
import { getChainAndPayloadsController } from './fetchFilteredPayloadsData';
import { formatPayloadFromServer } from './utils/formatPayloadFromServer';
import { getPayloadsDataRPC } from './utils/getPayloadsDataRPC';

export type FetchPayloadByIdParams = {
  chainWithController: string;
  payloadId: number;
  clients: ClientsRecord;
};

export async function fetchPayloadById({
  input,
}: {
  input: FetchPayloadByIdParams;
}) {
  const { chainId, payloadsController } = getChainAndPayloadsController(
    input.chainWithController,
  );

  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const url = `${INITIAL_API_URL}/payloads/getById/?payloadId=${input.payloadId}&payloadChainId=${chainId}&payloadsController=${payloadsController}`;
      const dataRaw = await fetch(url);
      const data = (await dataRaw.json())[0] as PayloadFromServer;
      return formatPayloadFromServer(data);
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error('Error getting payload data from API, using RPC fallback', e);
    return (
      await getPayloadsDataRPC({
        chainId,
        clients: input.clients,
        payloadsIds: [input.payloadId],
      })
    )[0];
  }
}
