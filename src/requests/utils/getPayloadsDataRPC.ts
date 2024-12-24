import { IPayloadsControllerDataHelper_ABI } from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { PayloadInitialStruct } from '../../types';

export type GetPayloadsData = {
  chainId: number;
  payloadsIds: number[];
  clients: ClientsRecord;
};

export async function getPayloadsDataRPC({
  chainId,
  payloadsIds,
  clients,
}: GetPayloadsData & { clients: ClientsRecord }) {
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
