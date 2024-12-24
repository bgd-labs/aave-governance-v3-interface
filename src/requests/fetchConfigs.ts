import { Client } from 'viem';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { ConfigsFromServer, ConstantsFromServer } from '../server/api/types';
import { getGovCoreConfigsRPC } from './utils/getGovCoreConfigsRPC';

export async function fetchConfigs({
  input,
}: {
  input: { govCoreClient: Client };
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const data = await Promise.all([
        (await (
          await fetch(`${INITIAL_API_URL}/votingConfigs/`)
        ).json()) as ConfigsFromServer,
        (await (
          await fetch(`${INITIAL_API_URL}/constants/`)
        ).json()) as ConstantsFromServer,
      ]);

      const contractsConstants = {
        precisionDivider: BigInt(data[1][0].PRECISION_DIVIDER),
        cooldownPeriod: BigInt(data[1][0].COOLDOWN_PERIOD),
        expirationTime: BigInt(data[1][0].PROPOSAL_EXPIRATION_TIME),
        cancellationFee: BigInt(data[1][0].CANCELLATION_FEE),
      };

      const votingConfigs = data[0].map((config) => {
        return {
          accessLevel: config.accessLevel,
          quorum: BigInt(config.yesThreshold ?? 0),
          differential: BigInt(config.yesNoDifferential ?? 0),
          minPropositionPower: BigInt(config.minPropositionPower ?? 0),
          coolDownBeforeVotingStart: config.coolDownBeforeVotingStart,
          votingDuration: config.votingDuration,
        };
      });

      return {
        contractsConstants,
        configs: votingConfigs,
      };
    }
    throw new Error('This chain id for gov core not supported by API');
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
