import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Address } from 'viem';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';

export async function updateRepresentatives({
  wagmiConfig,
  data,
}: {
  wagmiConfig?: Config;
  data: { representative: Address; chainId: bigint }[];
}) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: IGovernanceCore_ABI,
      address: appConfig.govCoreConfig.contractAddress,
      functionName: 'updateRepresentativesForChain',
      args: [data],
      chainId: appConfig.govCoreChainId,
    });
  }
  return undefined;
}
