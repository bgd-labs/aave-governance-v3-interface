import { IPayloadsControllerDataHelper_ABI } from '@bgd-labs/aave-address-book';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';

export type GetPayloadsData = {
  chainId: number;
  payloadsIds: number[];
  clients: Record<number, Client>;
};

export async function getPayloadsData({
  chainId,
  payloadsIds,
  clients,
}: GetPayloadsData) {
  const payloadsConfig = appConfig.payloadsControllerConfig[chainId];
  const payloadsData = await readContract(clients[chainId], {
    abi: IPayloadsControllerDataHelper_ABI,
    address: payloadsConfig.dataHelperContractAddress,
    functionName: 'getPayloadsData',
    args: [payloadsConfig.contractAddresses[0], payloadsIds],
  });
  return payloadsData.map((payload) => {
    return {
      ...payload,
      chain: BigInt(chainId),
      payloadsController: payloadsConfig.contractAddresses[0],
    };
  });
}
