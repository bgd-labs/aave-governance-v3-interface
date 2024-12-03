import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Address } from 'viem';
import { Config } from 'wagmi';

export async function executePayload({
  wagmiConfig,
  chainId,
  payloadId,
  payloadsController,
}: {
  wagmiConfig?: Config;
  chainId: number;
  payloadId: number;
  payloadsController: string;
}) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: IPayloadsControllerCore_ABI,
      address: payloadsController as Address,
      functionName: 'executePayload',
      args: [payloadId],
      chainId,
    });
  }
  return undefined;
}
