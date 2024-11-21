import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../configs/appConfig';

export async function fetchTotalProposalsCount({
  input,
}: {
  input: { govCoreClient: Client };
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposals count from API, using RPC fallback',
      e,
    );
    return await readContract(input.govCoreClient, {
      abi: IGovernanceCore_ABI,
      address: appConfig.govCoreConfig.contractAddress,
      functionName: 'getProposalsCount',
      args: [],
    });
  }
}
