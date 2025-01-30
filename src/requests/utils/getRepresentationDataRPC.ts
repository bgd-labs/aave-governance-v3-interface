import { IGovernanceDataHelper_ABI } from '@bgd-labs/aave-address-book/abis';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { FetchRepresentationsData } from '../fetchRepresentationsData';

export async function getRepresentationDataRPC({
  address,
  govCoreClient,
}: FetchRepresentationsData) {
  const data = await readContract(govCoreClient, {
    abi: IGovernanceDataHelper_ABI,
    address: appConfig.govCoreConfig.dataHelperContractAddress,
    functionName: 'getRepresentationData',
    args: [
      appConfig.govCoreConfig.contractAddress,
      address,
      appConfig.votingMachineChainIds.map((chainId) => BigInt(chainId)),
    ],
  });

  return {
    representative: data[0],
    represented: data[1],
  };
}
