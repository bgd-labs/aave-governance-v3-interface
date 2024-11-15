import { IGovernanceDataHelper_ABI } from '@bgd-labs/aave-address-book';
import { Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

import { VotingConfig } from '../../types';

export async function getGovCoreConfigs({
  client,
  govCoreContractAddress,
  govCoreDataHelperContractAddress,
}: {
  client: Client;
  govCoreContractAddress: Hex;
  govCoreDataHelperContractAddress: Hex;
}) {
  try {
    const accessLevels: Readonly<number[]> = [1, 2]; // access levels that we can’t get from contracts in any way, so far there are only two of them, we need to keep an eye on that suddenly there will be more of them
    const constants = await readContract(client, {
      abi: IGovernanceDataHelper_ABI,
      address: govCoreDataHelperContractAddress,
      functionName: 'getConstants',
      args: [govCoreContractAddress, accessLevels],
    });

    const contractsConstants = {
      precisionDivider: constants.precisionDivider,
      cooldownPeriod: constants.cooldownPeriod,
      expirationTime: constants.expirationTime,
      cancellationFee: constants.cancellationFee,
    };

    const configs: VotingConfig[] = [];

    for (let i = 0; i < accessLevels.length; i++) {
      const votingConfig = constants.votingConfigs[i];

      const config: VotingConfig = {
        accessLevel: votingConfig.accessLevel,
        votingDuration: votingConfig.config.votingDuration,
        quorum: votingConfig.config.yesThreshold || 200n,
        differential: votingConfig.config.yesNoDifferential || 50n,
        coolDownBeforeVotingStart:
          votingConfig.config.coolDownBeforeVotingStart,
        minPropositionPower: votingConfig.config.minPropositionPower,
      };

      configs.push(config);
    }

    return {
      contractsConstants,
      configs,
    };
  } catch {
    console.error('Cannot get gov core configs and constants. Set zero.');

    const contractsConstants = {
      precisionDivider: 0n,
      cooldownPeriod: 100n,
      expirationTime: 1000n,
      cancellationFee: 0n,
    };
    const configs = [
      {
        accessLevel: 1,
        votingDuration: 100,
        quorum: 200n,
        differential: 50n,
        coolDownBeforeVotingStart: 100,
        minPropositionPower: 100n,
      },
    ];

    return {
      contractsConstants,
      configs,
    };
  }
}
