import { IPayloadsControllerCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { writeContract } from '@wagmi/core';
import { Address, bytesToHex, stringToBytes } from 'viem';
import { Config } from 'wagmi';

import { PayloadAction } from '../../../types';

export async function createPayload({
  wagmiConfig,
  chainId,
  payloadsController,
  payloadActions,
}: {
  wagmiConfig?: Config;
  chainId: number;
  payloadActions: PayloadAction[];
  payloadsController: Address;
}) {
  const formattedPayloadActions = payloadActions.map((payloadData) => {
    return {
      target: payloadData.payloadAddress,
      withDelegateCall: payloadData.withDelegateCall,
      accessLevel: payloadData.accessLevel,
      value: BigInt(payloadData.value),
      signature: payloadData.signature,
      callData: bytesToHex(stringToBytes(payloadData.callData || '')),
    };
  });
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: IPayloadsControllerCore_ABI,
      address: payloadsController,
      functionName: 'createPayload',
      chainId,
      args: [formattedPayloadActions],
    });
  }
  return undefined;
}
