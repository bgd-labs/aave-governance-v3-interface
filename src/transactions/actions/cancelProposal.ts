import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';

// only for admin
export async function cancelProposal({
  wagmiConfig,
  proposalId,
}: {
  wagmiConfig?: Config;
  proposalId: number;
}) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: IGovernanceCore_ABI,
      address: appConfig.govCoreConfig.contractAddress,
      functionName: 'cancelProposal',
      args: [BigInt(proposalId)],
      chainId: appConfig.govCoreChainId,
    });
  }
  return undefined;
}
