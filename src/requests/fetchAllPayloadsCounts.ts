import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { Address } from 'viem';
import { readContract } from 'viem/actions';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';

export type FetchAllPayloadsCountsParams = {
  clients: ClientsRecord;
};

export async function fetchAllPayloadsCounts({
  input,
}: {
  input: FetchAllPayloadsCountsParams;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      return (await (
        await fetch(`${INITIAL_API_URL}/payloads/count/`)
      ).json()) as {
        chainId: number;
        payloadsController: Address;
        payloadCount: string;
      }[];
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error('Error getting payloads count from API', e);

    const totalCount: {
      chainId: number;
      payloadsController: Address;
      payloadCount: string;
    }[] = [];

    await Promise.all(
      Object.entries(appConfig.payloadsControllerConfig).map(
        async ([chainId, config]) => {
          await Promise.all(
            config.contractAddresses.map(async (address) => {
              const count = await readContract(input.clients[Number(chainId)], {
                abi: IPayloadsControllerCore_ABI,
                address: address,
                functionName: 'getPayloadsCount',
                args: [],
              });
              totalCount.push({
                chainId: Number(chainId),
                payloadsController: address,
                payloadCount: String(count),
              });
            }),
          );
        },
      ),
    );

    return totalCount;
  }
}
