import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { Address } from 'viem';
import { mainnet } from 'viem/chains';

import { appConfig, appUsedNetworks } from '../configs/appConfig';
import { INITIAL_API_URL, PAGE_SIZE } from '../configs/configs';
import { PayloadFromServer } from '../server/api/types';
import { fetchPayloads } from './fetchPayloads';
import { fetchPayloadsCount } from './fetchPayloadsCount';
import { formatPayloadFromServer } from './utils/formatPayloadFromServer';

export type FetchFilteredPayloadsDataParams = {
  clients: ClientsRecord;
  activePage: number;
  chainWithController: string;
};

function checkChainId(chainId?: string | number) {
  const chainIdFromQuery = Number(chainId);
  return appUsedNetworks.some((id) => chainIdFromQuery === id)
    ? chainIdFromQuery
    : appConfig.govCoreChainId;
}

export function getChainAndPayloadsController(chainWithController: string) {
  const chainId = Number(chainWithController.split('_')[0]);
  const payloadsController = chainWithController.split('_')[1];
  return {
    chainId: checkChainId(chainId),
    payloadsController: payloadsController as Address,
  };
}

export async function fetchFilteredPayloadsData({
  input,
}: {
  input: FetchFilteredPayloadsDataParams;
}) {
  const { chainId, payloadsController } = getChainAndPayloadsController(
    input.chainWithController,
  );

  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      // TODO: request not working
      const url = `${INITIAL_API_URL}/proposals/get/?pageSize=${PAGE_SIZE}&page=${input.activePage}$payloadChainId=${chainId}&payloadsController=${payloadsController}`;

      const data = (await (await fetch(url)).json()) as PayloadFromServer[];

      const formattedData = data.map((payload) =>
        formatPayloadFromServer(payload),
      );

      // TODO: temporary
      const count = await fetchPayloadsCount({ input });

      return {
        data: formattedData,
        count,
      };
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error('Error getting filtered payloads data from API', e);

    const count = await fetchPayloadsCount({ input });

    const currentPage = input.activePage || 0;
    const size = count > PAGE_SIZE ? count - currentPage * PAGE_SIZE : count;
    const ids = Array.from(Array(size).keys()).filter(
      (id) => id >= size - PAGE_SIZE && id <= count - 1,
    );

    const data = await fetchPayloads({
      input: {
        chainId: chainId,
        payloadsIds: ids,
        clients: input.clients,
      },
    });

    return {
      data,
      count,
      ids,
    };
  }
}
