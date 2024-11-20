import { IPayloadsControllerDataHelper_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { PayloadInitialStruct } from '../../types';
import { GetPayloadsData } from './getPayloadsData';

export async function getPayloadsDataRPC({
  chainId,
  payloadsIds,
  clients,
}: GetPayloadsData & { clients: Record<number, Client> }) {
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
    } as PayloadInitialStruct;
  });
}
