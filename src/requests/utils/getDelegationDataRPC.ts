import { IGovernanceCore_ABI } from '@bgd-labs/aave-address-book/abis';
import { Address, Client, formatUnits, getContract } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { DECIMALS } from '../../configs/configs';
import { getAssetSymbolByAddress } from '../../helpers/getAssetName';
import { getToAddress } from '../../store/selectors/delegationSelectors';
import { Asset } from '../../types';
import { IAaveTokenV3_ABI } from '../abis/IAaveTokenV3';
import { IBaseVotingStrategy_ABI } from '../abis/IBaseVotingStrategy';

export type GetDelegationDataRPC = {
  walletAddress: Address;
  govCoreClient: Client;
};

export async function getDelegationDataRPC({
  walletAddress,
  govCoreClient,
}: GetDelegationDataRPC) {
  const votingStrategyAddress = await readContract(govCoreClient, {
    abi: IGovernanceCore_ABI,
    address: appConfig.govCoreConfig.contractAddress,
    functionName: 'getPowerStrategy',
    args: [],
  });
  const underlyingAssets = await readContract(govCoreClient, {
    abi: IBaseVotingStrategy_ABI,
    address: votingStrategyAddress,
    functionName: 'getVotingAssetList',
    args: [],
  });

  return await Promise.all(
    underlyingAssets.map(async (underlyingAsset) => {
      const contract = getContract({
        abi: IAaveTokenV3_ABI,
        address: underlyingAsset,
        client: govCoreClient,
      });
      const symbol = getAssetSymbolByAddress(underlyingAsset) as Asset;
      const balance = await contract.read.balanceOf([walletAddress]);

      const delegatesAddresses = await contract.read.getDelegates([
        walletAddress,
      ]);

      const votingToAddress = delegatesAddresses[0];
      const propositionToAddress = delegatesAddresses[1];

      return {
        underlyingAsset,
        symbol,
        amount: +formatUnits(balance, DECIMALS),
        votingToAddress: getToAddress(walletAddress, votingToAddress),
        propositionToAddress: getToAddress(walletAddress, propositionToAddress),
      };
    }),
  );
}
