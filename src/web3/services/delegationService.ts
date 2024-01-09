'use client';

import {
  aaveTokenV3Contract,
  aTokenWithDelegationContract,
  metaDelegateHelperContract,
  normalizeBN,
} from '@bgd-labs/aave-governance-ui-helpers';
import { IAaveTokenV3_ABI } from '@bgd-labs/aave-governance-ui-helpers/dist/abis/IAaveTokenV3';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { WalletClient } from '@wagmi/core';
import dayjs from 'dayjs';
import { encodeFunctionData, Hex, hexToSignature, zeroAddress } from 'viem';

import { appConfig } from '../../utils/appConfig';
import { getTokenName } from '../../utils/getTokenName';

export enum GovernancePowerType {
  VOTING,
  PROPOSITION,
}

export enum GovernancePowerTypeApp {
  VOTING,
  PROPOSITION,
  All,
}

export type DelegateDataParams = {
  underlyingAsset: Hex;
  delegator: Hex;
  delegatee: Hex;
  delegationType: GovernancePowerTypeApp;
  increaseNonce?: boolean;
};

export type BatchMetaDelegateParams = {
  underlyingAsset: Hex;
  delegator: Hex;
  delegatee: Hex;
  deadline: bigint;
  v: number;
  r: Hex;
  s: Hex;
  delegationType: GovernancePowerTypeApp;
};

export class DelegationService {
  private walletClient: WalletClient | undefined = undefined;
  private clients: ClientsRecord;

  constructor(clients: ClientsRecord) {
    this.clients = clients;
  }

  connectSigner(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  async getUserPowers(userAddress: Hex, underlyingAssets: Hex[]) {
    const contracts = underlyingAssets.map((asset) => {
      return {
        contract: aaveTokenV3Contract({
          contractAddress: asset,
          client: this.clients[appConfig.govCoreChainId],
        }),
        underlyingAsset: asset,
      };
    });

    return await Promise.all(
      contracts.map(async (contract) => {
        const data = await Promise.all([
          await contract.contract.read.balanceOf([userAddress]),
          await contract.contract.read.getPowersCurrent([userAddress]),
          await contract.contract.read.getDelegates([userAddress]),
        ]);

        const isPropositionPowerDelegated =
          data[2][GovernancePowerType.PROPOSITION] === userAddress ||
          data[2][GovernancePowerType.PROPOSITION] === zeroAddress
            ? false
            : !!data[2][GovernancePowerType.PROPOSITION];
        const isVotingPowerDelegated =
          data[2][GovernancePowerType.VOTING] === userAddress ||
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
            userBalance: normalizeBN(
              formattedUserBalance.toString(),
              18,
            ).toString(),
            totalPowerBasic: totalPower.toString(),
            totalPower: normalizeBN(totalPower.toString(), 18).toString(),
            delegatedPowerBasic: String(totalPower - formattedUserBalance),
            delegatedPower: normalizeBN(
              String(totalPower - formattedUserBalance),
              18,
            ).toString(),
            isWithDelegatedPower: formattedUserBalance !== totalPower,
          };
        };

        const proposition = getPower(
          data[1][1],
          GovernancePowerType.PROPOSITION,
        );
        const voting = getPower(data[1][0], GovernancePowerType.VOTING);

        return {
          timestamp: dayjs().unix(),
          tokenName: getTokenName(contract.underlyingAsset),
          underlyingAsset: contract.underlyingAsset,
          proposition,
          voting,
        };
      }),
    );
  }

  async getDelegates(underlyingAsset: Hex, delegator: Hex) {
    const assetContract = aaveTokenV3Contract({
      contractAddress: underlyingAsset,
      client: this.clients[appConfig.govCoreChainId],
    });

    return await Promise.all([
      await assetContract.read.getDelegateeByType([
        delegator,
        GovernancePowerType.VOTING,
      ]),
      await assetContract.read.getDelegateeByType([
        delegator,
        GovernancePowerType.PROPOSITION,
      ]),
    ]);
  }

  async getDelegatedPropositionPower(underlyingAssets: Hex[], user: Hex) {
    const contracts = underlyingAssets.map((asset) => {
      return {
        contract: aaveTokenV3Contract({
          contractAddress: asset,
          client: this.clients[appConfig.govCoreChainId],
        }),
        underlyingAsset: asset,
      };
    });

    return Promise.all(
      contracts.map(async (contract) => {
        const power = await contract.contract.read.getPowerCurrent([
          user,
          GovernancePowerType.PROPOSITION,
        ]);

        return {
          underlyingAsset: contract.underlyingAsset,
          delegationPropositionPower: power.toString(),
        };
      }),
    );
  }

  async getDelegatedVotingPowerByBlockHash(
    blockHash: Hex,
    userAddress: Hex,
    underlyingAssets: Hex[],
  ) {
    const client = this.clients[appConfig.govCoreChainId];
    const blockNumber = await client.getBlock({
      blockHash,
    });

    const userBalances = await client.multicall({
      contracts: [
        ...underlyingAssets.map((asset) => {
          const wagmiContract = {
            address: asset,
            abi: IAaveTokenV3_ABI,
          } as const;

          return {
            ...wagmiContract,
            functionName: 'balanceOf',
            args: [userAddress],
          };
        }),
      ],
      blockNumber: blockNumber.number,
    });

    const votingPowers = await client.multicall({
      contracts: [
        ...underlyingAssets.map((asset) => {
          const wagmiContract = {
            address: asset,
            abi: IAaveTokenV3_ABI,
          } as const;

          return {
            ...wagmiContract,
            functionName: 'getPowerCurrent',
            args: [userAddress, GovernancePowerType.VOTING],
          };
        }),
      ],
      blockNumber: blockNumber.number,
    });

    return underlyingAssets.map((asset, index) => {
      const userBalance = userBalances[index].result;
      const votingPower = votingPowers[index].result;

      return {
        blockHash,
        tokenName: getTokenName(asset),
        underlyingAsset: asset,
        basicValue: String(votingPower),
        value: normalizeBN(String(votingPower), 18).toString(),
        userBalance: normalizeBN(String(userBalance), 18).toString(),
        isWithDelegatedPower: userBalance !== votingPower,
      };
    });
  }

  async delegateMetaSig(
    underlyingAsset: Hex,
    delegateToAddress: Hex,
    delegationType: GovernancePowerTypeApp,
    activeAddress: Hex,
    increaseNonce?: boolean,
  ): Promise<BatchMetaDelegateParams | undefined> {
    if (this.walletClient) {
      const deadline = BigInt(Math.floor(Date.now() / 1000 + 3600));
      const isAAAVE =
        underlyingAsset.toLowerCase() ===
        appConfig.additional.aAaveAddress.toLowerCase();
      const isAAVE =
        underlyingAsset.toLowerCase() ===
        appConfig.additional.aaveAddress.toLowerCase();

      const normalAssetContract = aaveTokenV3Contract({
        contractAddress: underlyingAsset,
        client: this.clients[appConfig.govCoreChainId],
      });
      const aAssetContract = aTokenWithDelegationContract({
        contractAddress: underlyingAsset,
        client: this.clients[appConfig.govCoreChainId],
      });

      // TODO: maybe need fix name
      // const name = isAAAVE
      //   ? await aAssetContract.name()
      //   : await normalAssetContract.name();

      const name = isAAAVE
        ? 'Aave Ethereum AAVE'
        : isAAVE
          ? 'Aave token V3'
          : await normalAssetContract.read.name();

      const nonce = isAAAVE
        ? await aAssetContract.read.nonces([activeAddress])
        : await normalAssetContract.read._nonces([activeAddress]);

      const isAllDelegate = delegationType === GovernancePowerTypeApp.All;

      const sigBaseType = [
        { name: 'nonce', type: 'uint256' },
        {
          name: 'deadline',
          type: 'uint256',
        },
      ];
      const sigParametersType = [
        {
          name: 'delegator',
          type: 'address',
        },
        {
          name: 'delegatee',
          type: 'address',
        },
      ];
      const sigDelegationTypeType = [
        {
          name: 'delegationType',
          type: 'uint8',
        },
      ];

      const typesData = {
        delegator: activeAddress,
        delegatee: delegateToAddress,
        nonce: BigInt(increaseNonce ? Number(nonce) + 1 : nonce),
        deadline,
      };

      const sig = hexToSignature(
        await this.walletClient.signTypedData({
          domain: {
            name: name,
            version: '2',
            chainId: appConfig.govCoreChainId,
            verifyingContract: underlyingAsset,
          },
          types: isAllDelegate
            ? { Delegate: [...sigParametersType, ...sigBaseType] }
            : {
                DelegateByType: [
                  ...sigParametersType,
                  ...sigDelegationTypeType,
                  ...sigBaseType,
                ],
              },
          primaryType: isAllDelegate ? 'Delegate' : 'DelegateByType',
          message: isAllDelegate
            ? {
                ...typesData,
              }
            : { ...typesData, delegationType },
        }),
      );

      return {
        underlyingAsset,
        delegator: activeAddress,
        delegatee: delegateToAddress,
        delegationType,
        deadline,
        v: Number(sig.v),
        r: sig.r,
        s: sig.s,
      };
    }
  }

  async batchMetaDelegate(sigs: BatchMetaDelegateParams[]) {
    const delegateHelperContract = metaDelegateHelperContract({
      contractAddress: appConfig.additional.delegationHelper,
      client: this.clients[appConfig.govCoreChainId],
      walletClient: this.walletClient,
    });

    // TODO: maybe don't need to increase gas limit for mainnets
    const gasLimit = await delegateHelperContract.estimateGas.batchMetaDelegate(
      [sigs],
    );

    return delegateHelperContract.write.batchMetaDelegate([sigs], {
      gas: gasLimit + BigInt(100000),
    });
  }

  // need only for gnosis safe wallet
  async delegate(
    underlyingAsset: Hex,
    delegateToAddress: Hex,
    type: GovernancePowerTypeApp,
  ) {
    const tokenContract = aaveTokenV3Contract({
      contractAddress: underlyingAsset,
      client: this.clients[appConfig.govCoreChainId],
      walletClient: this.walletClient,
    });

    if (type === GovernancePowerTypeApp.All) {
      return tokenContract.write.delegate([delegateToAddress], {
        // TODO: need for gnosis safe wallet for now (https://github.com/safe-global/safe-apps-sdk/issues/480)
        value: BigInt(0) as any,
      });
    } else {
      return tokenContract.write.delegateByType([delegateToAddress, type], {
        // TODO: need for gnosis safe wallet for now (https://github.com/safe-global/safe-apps-sdk/issues/480)
        value: BigInt(0) as any,
      });
    }
  }

  getDelegateTxParams(
    underlyingAsset: Hex,
    delegateToAddress: Hex,
    type: GovernancePowerTypeApp,
  ) {
    const tokenContract = aaveTokenV3Contract({
      contractAddress: underlyingAsset,
      client: this.clients[appConfig.govCoreChainId],
      walletClient: this.walletClient,
    });

    if (type === GovernancePowerTypeApp.All) {
      return encodeFunctionData({
        abi: tokenContract.abi,
        functionName: 'delegate',
        args: [delegateToAddress],
      });
    } else {
      return encodeFunctionData({
        abi: tokenContract.abi,
        functionName: 'delegateByType',
        args: [delegateToAddress, type],
      });
    }
  }
}
