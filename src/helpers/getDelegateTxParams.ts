import { Address, encodeFunctionData } from 'viem';

import { IAaveTokenV3_ABI } from '../requests/abis/IAaveTokenV3';
import { GovernancePowerTypeApp } from '../types';

export function getDelegateTxParams(
  delegateToAddress: Address,
  type: GovernancePowerTypeApp,
) {
  if (type === GovernancePowerTypeApp.All) {
    return encodeFunctionData({
      abi: IAaveTokenV3_ABI,
      functionName: 'delegate',
      args: [delegateToAddress],
    });
  } else {
    return encodeFunctionData({
      abi: IAaveTokenV3_ABI,
      functionName: 'delegateByType',
      args: [delegateToAddress, type],
    });
  }
}
