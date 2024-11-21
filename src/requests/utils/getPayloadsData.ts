import { Client } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { cachingLayer } from './cachingLayer';
import { getPayloadsDataRPC } from './getPayloadsDataRPC';

export type GetPayloadsData = {
  chainId: number;
  payloadsIds: number[];
  clients?: Record<number, Client>;
};

export async function getPayloadsData({
  chainId,
  payloadsIds,
  clients,
}: GetPayloadsData) {
  const payloadsConfig = appConfig.payloadsControllerConfig[chainId];
  // TODO: turn on for mainnets
  // try {
  //   return await Promise.all(
  //     payloadsIds.map(async (id) => {
  //       const data = await cachingLayer.getPayload({
  //         chainId,
  //         payloadsController: payloadsConfig.contractAddresses[0],
  //         payloadId: id,
  //       });
  //       return {
  //         id: BigInt(id),
  //         chain: BigInt(chainId),
  //         payloadsController: payloadsConfig.contractAddresses[0],
  //         data: {
  //           ...data.payload,
  //         },
  //         logs: data.logs,
  //       };
  //     }),
  //   );
  // } catch (e) {
  //   console.error(
  //     'Error getting payload data for list with cache, using RPC fallback',
  //     e,
  //   );
  if (clients) {
    return await getPayloadsDataRPC({
      chainId,
      payloadsIds,
      clients,
    });
  } else {
    throw new Error('Clients not passed. Try to pass clients and try again');
  }
  // }
}
