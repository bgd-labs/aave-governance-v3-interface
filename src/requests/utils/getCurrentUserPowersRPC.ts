import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import dayjs from 'dayjs';
import { Address, Client, formatUnits, getContract, zeroAddress } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { DECIMALS } from '../../configs/configs';
import { getAssetSymbolByAddress } from '../../helpers/getAssetName';
import { Asset, GovernancePowerType, PowersByAssets } from '../../types';
import { IAaveTokenV3_ABI } from '../abis/IAaveTokenV3';
import { IBaseVotingStrategy_ABI } from '../abis/IBaseVotingStrategy';

export type GetCurrentUserPowersRPC = {
  walletAddress: Address;
  govCoreClient: Client;
};

export async function getCurrentUserPowersRPC({
  walletAddress,
  govCoreClient,
}: GetCurrentUserPowersRPC) {
  const votingStrategyAddress = await readContract(govCoreClient, {
    abi: IGovernanceCore_ABI,
    address: appConfig.govCoreConfig.contractAddress,
    functionName: 'getPowerStrategy',
    args: [],
  });
  const assets = await readContract(govCoreClient, {
    abi: IBaseVotingStrategy_ABI,
    address: votingStrategyAddress,
    functionName: 'getVotingAssetList',
    args: [],
  });

  const contracts = assets.map((asset) =>
    getContract({
      address: asset,
      abi: IAaveTokenV3_ABI,
      client: govCoreClient,
    }),
  );

  const powers = await Promise.all(
    contracts.map(async (contract) => {
      const data = await Promise.all([
        await contract.read.balanceOf([walletAddress]),
        await contract.read.getPowersCurrent([walletAddress]),
        await contract.read.getDelegates([walletAddress]),
      ]);

      const isPropositionPowerDelegated =
        data[2][GovernancePowerType.PROPOSITION] === walletAddress ||
        data[2][GovernancePowerType.PROPOSITION] === zeroAddress
          ? false
          : !!data[2][GovernancePowerType.PROPOSITION];
      const isVotingPowerDelegated =
        data[2][GovernancePowerType.VOTING] === walletAddress ||
        data[2][GovernancePowerType.VOTING] === zeroAddress
          ? false
          : !!data[2][GovernancePowerType.VOTING];

      const getPower = (totalPower: bigint, type: GovernancePowerType) => {
        let formattedUserBalance = data[0];
        if (
          type === GovernancePowerType.PROPOSITION &&
          isPropositionPowerDelegated
        ) {
          formattedUserBalance = BigInt(0);
        } else if (
          type === GovernancePowerType.VOTING &&
          isVotingPowerDelegated
        ) {
          formattedUserBalance = BigInt(0);
        } else if (isPropositionPowerDelegated && isVotingPowerDelegated) {
          formattedUserBalance = BigInt(0);
        }

        return {
          userBalance: formattedUserBalance,
          totalPower: totalPower,
          delegatedPower: totalPower - formattedUserBalance,
          isWithDelegatedPower: formattedUserBalance !== totalPower,
        };
      };

      const proposition = getPower(data[1][1], GovernancePowerType.PROPOSITION);
      const voting = getPower(data[1][0], GovernancePowerType.VOTING);

      return {
        timestamp: dayjs().unix(),
        tokenName: getAssetSymbolByAddress(contract.address),
        underlyingAsset: contract.address,
        proposition,
        voting,
      };
    }),
  );

  const powersByAssets: PowersByAssets = {};
  powers.forEach((asset) => {
    powersByAssets[asset.underlyingAsset] = {
      tokenName: asset.tokenName ?? Asset.AAVE,
      underlyingAsset: asset.underlyingAsset,
      proposition: asset.proposition,
      voting: asset.voting,
    };
  });

  const totalPropositionPower = powers
    .map((power) => power.proposition.totalPower)
    .reduce((sum, value) => sum + value, 0n);
  const totalVotingPower = powers
    .map((power) => power.voting.totalPower)
    .reduce((sum, value) => sum + value, 0n);

  const yourPropositionPower = powers
    .map((power) => power.proposition.userBalance)
    .reduce((sum, value) => sum + value, 0n);
  const yourVotingPower = powers
    .map((power) => power.voting.userBalance)
    .reduce((sum, value) => sum + value, 0n);

  const delegatedPropositionPower = powers
    .map((power) => power.proposition.delegatedPower)
    .reduce((sum, value) => sum + value, 0n);
  const delegatedVotingPower = powers
    .map((power) => power.voting.delegatedPower)
    .reduce((sum, value) => sum + value, 0n);

  return {
    timestamp: Number(powers[0].timestamp),
    totalPropositionPower: +formatUnits(totalPropositionPower, DECIMALS),
    totalVotingPower: +formatUnits(totalVotingPower, DECIMALS),
    yourPropositionPower: +formatUnits(yourPropositionPower, DECIMALS),
    yourVotingPower: +formatUnits(yourVotingPower, DECIMALS),
    delegatedPropositionPower: +formatUnits(
      delegatedPropositionPower,
      DECIMALS,
    ),
    delegatedVotingPower: +formatUnits(delegatedVotingPower, DECIMALS),
    powersByAssets,
  };
}
