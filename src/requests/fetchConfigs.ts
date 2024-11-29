import { Client } from 'viem';

import { appConfig } from '../configs/appConfig';
import { getGovCoreConfigsRPC } from './utils/getGovCoreConfigsRPC';

export async function fetchConfigs({
  input,
}: {
  input: { govCoreClient: Client };
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error('Error getting configs from API, using RPC fallback', e);
    return await getGovCoreConfigsRPC({
      client: input.govCoreClient,
      govCoreContractAddress: appConfig.govCoreConfig.contractAddress,
      govCoreDataHelperContractAddress:
        appConfig.govCoreConfig.dataHelperContractAddress,
    });
  }
}
