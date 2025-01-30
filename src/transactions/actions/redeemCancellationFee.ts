import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';

export async function redeemCancellationFee({
  wagmiConfig,
  proposalsIds,
}: {
  wagmiConfig?: Config;
  proposalsIds: number[];
}) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: IGovernanceCore_ABI,
      address: appConfig.govCoreConfig.contractAddress,
      functionName: 'redeemCancellationFee',
      args: [proposalsIds.map((id) => BigInt(id))],
      chainId: appConfig.govCoreChainId,
    });
  }
  return undefined;
}
