import { IVotingMachineWithProofs_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Address, Hex } from 'viem';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';

export async function vote({
  wagmiConfig,
  votingChainId,
  proposalId,
  support,
  proofs,
  voterAddress,
  proofOfRepresentation,
}: {
  wagmiConfig?: Config;
  votingChainId: number;
  proposalId: number;
  support: boolean;
  proofs: {
    underlyingAsset: Address;
    slot: bigint;
    proof: Hex;
  }[];
  voterAddress?: Address;
  proofOfRepresentation?: Hex;
}) {
  if (wagmiConfig) {
    return !!voterAddress && !!proofOfRepresentation
      ? writeContract(wagmiConfig, {
          abi: IVotingMachineWithProofs_ABI,
          address: appConfig.votingMachineConfig[votingChainId].contractAddress,
          functionName: 'submitVoteAsRepresentative',
          args: [
            BigInt(proposalId),
            support,
            voterAddress,
            proofOfRepresentation,
            proofs,
          ],
          chainId: votingChainId,
        })
      : writeContract(wagmiConfig, {
          abi: IVotingMachineWithProofs_ABI,
          address: appConfig.votingMachineConfig[votingChainId].contractAddress,
          functionName: 'submitVote',
          args: [BigInt(proposalId), support, proofs],
          chainId: votingChainId,
        });
  }
  return undefined;
}
