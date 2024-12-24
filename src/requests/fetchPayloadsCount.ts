import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { Address } from 'viem';
import { readContract } from 'viem/actions';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { getChainAndPayloadsController } from './fetchFilteredPayloadsData';

export type FetchPayloadsCountParams = {
  clients: ClientsRecord;
  chainWithController: string;
};

export async function fetchPayloadsCount({
  input,
}: {
  input: FetchPayloadsCountParams;
}) {
  const { chainId, payloadsController } = getChainAndPayloadsController(
    input.chainWithController,
  );

  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const count = (await (
        await fetch(`${INITIAL_API_URL}/payloads/count/`)
      ).json()) as {
        chainId: number;
        payloadsController: Address;
        payloadCount: string;
      }[];

      return Number(
        count.filter(
          (chain) =>
            chain.chainId === chainId &&
            chain.payloadsController === payloadsController,
        )[0].payloadCount,
      );
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error('Error getting payloads count from API', e);

    return await readContract(input.clients[chainId], {
      abi: IPayloadsControllerCore_ABI,
      address: payloadsController as Address,
      functionName: 'getPayloadsCount',
      args: [],
    });
  }
}
