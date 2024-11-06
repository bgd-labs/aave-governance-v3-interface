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
      precisionDivider: constants.precisionDivider.toString(),
      cooldownPeriod: Number(constants.cooldownPeriod),
      expirationTime: Number(constants.expirationTime),
      cancellationFee: constants.cancellationFee.toString(),
    };

    const configs: VotingConfig[] = [];

    for (let i = 0; i < accessLevels.length; i++) {
      const votingConfig = constants.votingConfigs[i];

      const config: VotingConfig = {
        accessLevel: votingConfig.accessLevel,
        votingDuration: votingConfig.config.votingDuration,
        quorum: Number(votingConfig.config.yesThreshold) || 200,
        differential: Number(votingConfig.config.yesNoDifferential) || 50,
        coolDownBeforeVotingStart:
          votingConfig.config.coolDownBeforeVotingStart,
        minPropositionPower: Number(votingConfig.config.minPropositionPower),
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
      precisionDivider: '0',
      cooldownPeriod: 100,
      expirationTime: 1000,
      cancellationFee: '0',
    };
    const configs = [
      {
        accessLevel: 1,
        votingDuration: 100,
        quorum: 200,
        differential: 50,
        coolDownBeforeVotingStart: 100,
        minPropositionPower: 100,
      },
    ];

    return {
      contractsConstants,
      configs,
    };
  }
}
