import { Client } from 'viem';

import { appConfig } from '../configs/appConfig';
import { getGovCoreConfigs } from './utils/getGovCoreConfigs';

export async function fetchConfigs({
  input,
}: {
  input: { govCoreClient: Client };
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error('Error getting configs from API, using RPC fallback', e);
    return await getGovCoreConfigs({
      client: input.govCoreClient,
      govCoreContractAddress: appConfig.govCoreConfig.contractAddress,
      govCoreDataHelperContractAddress:
        appConfig.govCoreConfig.dataHelperContractAddress,
    });
  }
}
