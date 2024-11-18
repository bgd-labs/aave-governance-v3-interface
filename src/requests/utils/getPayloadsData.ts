import { appConfig } from '../../configs/appConfig';
import { cachingLayer } from './cachingLayer';

export type GetPayloadsData = {
  chainId: number;
  payloadsIds: number[];
};

export async function getPayloadsData({
  chainId,
  payloadsIds,
}: GetPayloadsData) {
  const payloadsConfig = appConfig.payloadsControllerConfig[chainId];
  return await Promise.all(
    payloadsIds.map(async (id) => {
      const data = await cachingLayer.getPayload({
        chainId,
        payloadsController: payloadsConfig.contractAddresses[0],
        payloadId: id,
      });

      return {
        ...data,
        payload: {
          id: BigInt(id),
          data: {
            ...data.payload,
            chain: BigInt(chainId),
            payloadsController: payloadsConfig.contractAddresses[0],
          },
        },
      };
    }),
  );
}
