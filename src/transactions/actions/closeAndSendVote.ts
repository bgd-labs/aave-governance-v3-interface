import { IVotingMachineWithProofs_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';

export async function closeAndSendVote({
  wagmiConfig,
  votingChainId,
  proposalId,
}: {
  wagmiConfig?: Config;
  votingChainId: number;
  proposalId: number;
}) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: IVotingMachineWithProofs_ABI,
      address: appConfig.votingMachineConfig[votingChainId].contractAddress,
      functionName: 'closeAndSendVote',
      args: [BigInt(proposalId)],
      chainId: votingChainId,
    });
  }
  return undefined;
}
