import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../configs/appConfig';
import { getGovCoreConfigs } from './utils/getGovCoreConfigs';

export async function fetchInitialData({
  input,
}: {
  input: { govCoreClient: Client };
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting initial configs from API, using RPC fallback',
      e,
    );

    const [govCoreConfigs, proposalsCount] = await Promise.all([
      await getGovCoreConfigs({
        client: input.govCoreClient,
        govCoreContractAddress: appConfig.govCoreConfig.contractAddress,
        govCoreDataHelperContractAddress:
          appConfig.govCoreConfig.dataHelperContractAddress,
      }),
      await readContract(input.govCoreClient, {
        abi: IGovernanceCore_ABI,
        address: appConfig.govCoreConfig.contractAddress,
        functionName: 'getProposalsCount',
        args: [],
      }),
    ]);

    return {
      ...govCoreConfigs,
      totalProposalsCount: Number(proposalsCount),
    };
  }
}
