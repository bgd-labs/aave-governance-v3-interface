import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';

export async function fetchTotalProposalsCount({
  input,
}: {
  input: { govCoreClient: Client };
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      return BigInt(
        await (await fetch(`${INITIAL_API_URL}/proposals/count/`)).text(),
      );
    }
    throw new Error('This chain id for gov core not supported by API');
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
