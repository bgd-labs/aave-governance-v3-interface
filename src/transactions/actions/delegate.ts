import { writeContract } from '@wagmi/core';
import { Address } from 'viem';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';
import { IAaveTokenV3_ABI } from '../../requests/abis/IAaveTokenV3';
import { GovernancePowerTypeApp } from '../../types';

export async function delegate({
  wagmiConfig,
  underlyingAsset,
  delegateToAddress,
  type,
}: {
  wagmiConfig?: Config;
  underlyingAsset: Address;
  delegateToAddress: Address;
  type: GovernancePowerTypeApp;
}) {
  if (wagmiConfig) {
    if (type === GovernancePowerTypeApp.All) {
      return writeContract(wagmiConfig, {
        abi: IAaveTokenV3_ABI,
        address: underlyingAsset,
        functionName: 'delegate',
        args: [delegateToAddress],
        chainId: appConfig.govCoreChainId,
      });
    } else {
      return writeContract(wagmiConfig, {
        abi: IAaveTokenV3_ABI,
        address: underlyingAsset,
        functionName: 'delegateByType',
        args: [delegateToAddress, type],
        chainId: appConfig.govCoreChainId,
      });
    }
  }
  return undefined;
}
