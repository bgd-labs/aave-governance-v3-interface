import { IMetaDelegateHelper_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';
import { BatchMetaDelegateParams } from '../../types';

export async function batchMetaDelegate({
  wagmiConfig,
  sigs,
}: {
  wagmiConfig?: Config;
  sigs: BatchMetaDelegateParams[];
}) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: IMetaDelegateHelper_ABI,
      address: appConfig.additional.delegationHelper,
      functionName: 'batchMetaDelegate',
      args: [sigs],
      chainId: appConfig.govCoreChainId,
    });
  }
  return undefined;
}
