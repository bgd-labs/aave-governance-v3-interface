import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { Address } from 'viem';
import { mainnet } from 'viem/chains';

import { appConfig, appUsedNetworks } from '../configs/appConfig';
import { INITIAL_API_URL, PAGE_SIZE } from '../configs/configs';
import { PaginatedPayloadsFromServer } from '../server/api/types';
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
      const url = `${INITIAL_API_URL}/payloads/get/?pageSize=${PAGE_SIZE}&page=${input.activePage + 1}&payloadChainId=${chainId}&payloadsController=${payloadsController}`;
      const data = (await (
        await fetch(url)
      ).json()) as PaginatedPayloadsFromServer;

      const formattedData = data.payloads.map((payload) =>
        formatPayloadFromServer(payload),
      );

      const count = data.totalPayloadsCount[0].count;

      const currentPage = input.activePage + 1 || 1;
      const size = count > PAGE_SIZE ? count - currentPage * PAGE_SIZE : count;
      const ids = Array.from(Array(size).keys()).filter(
        (id) => id >= size - PAGE_SIZE && id <= count - 1,
      );

      return {
        data: formattedData,
        count,
        ids,
      };
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error(
      'Error getting filtered payloads data from API, using RPC fallback',
      e,
    );

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
