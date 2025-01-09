import { Address, Client } from 'viem';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { RepresentativeItem } from '../server/api/types';
import { getRepresentationDataRPC } from './utils/getRepresentationDataRPC';

export type FetchRepresentationsData = {
  address: Address;
  govCoreClient: Client;
  rpcOnly?: boolean;
};

export async function fetchRepresentationsData({
  input,
}: {
  input: FetchRepresentationsData;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      if (input.rpcOnly) {
        return await getRepresentationDataRPC({ ...input });
      } else {
        const data = await Promise.all([
          (await (
            await fetch(
              `${INITIAL_API_URL}/representatives/${input.address}/representing/`,
            )
          ).json()) as RepresentativeItem[],
          (await (
            await fetch(
              `${INITIAL_API_URL}/representatives/${input.address}/get/`,
            )
          ).json()) as RepresentativeItem[],
        ]);

        const representedChainIds = data[0]
          .map((represented) => BigInt(represented.representationChainId))
          .filter((value, index, self) => self.indexOf(value) === index);

        return {
          representative: data[1].map((representative) => ({
            chainId: BigInt(representative.representationChainId),
            representative: representative.representative,
          })),
          represented: representedChainIds.map((chainId) => {
            const items = data[0].filter(
              (represented) =>
                represented.representationChainId === Number(chainId),
            );
            return {
              chainId,
              votersRepresented: items.map((item) => item.represented),
            };
          }),
        };
      }
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error(
      'Error getting representations data by user from API, using RPC fallback',
      e,
    );
    return await getRepresentationDataRPC({ ...input });
  }
}
