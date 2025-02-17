'use client';

import { IMetaDelegateHelper_ABI } from '@bgd-labs/aave-address-book/abis';
import { normalizeBN } from '@bgd-labs/aave-governance-ui-helpers';
import { IAaveTokenV3_ABI } from '@bgd-labs/aave-governance-ui-helpers/dist/abis/IAaveTokenV3';
import { IATokenWithDelegation_ABI } from '@bgd-labs/aave-governance-ui-helpers/dist/abis/IATokenWithDelegation';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { signTypedData, writeContract } from '@wagmi/core';
import { sendCalls } from '@wagmi/core/experimental';
import dayjs from 'dayjs';
import {
  Address,
  encodeFunctionData,
  getContract,
  Hex,
  hexToSignature,
  zeroAddress,
} from 'viem';
import { getBlock, multicall } from 'viem/actions';
import { Config } from 'wagmi';

import { appConfig } from '../../utils/appConfig';
import { getAssetName } from '../../utils/getAssetName';

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
  underlyingAsset: Address;
  delegator: Address;
  delegatee: Address;
  delegationType: GovernancePowerTypeApp;
  increaseNonce?: boolean;
};

export type BatchMetaDelegateParams = {
  underlyingAsset: Address;
  delegator: Address;
  delegatee: Address;
  deadline: bigint;
  v: number;
  r: Hex;
  s: Hex;
  delegationType: GovernancePowerTypeApp;
};

export class DelegationService {
  private wagmiConfig: Config | undefined = undefined;
  private clients: ClientsRecord;

  constructor(clients: ClientsRecord) {
    this.clients = clients;
  }

  connectSigner(wagmiConfig: Config) {
    this.wagmiConfig = wagmiConfig;
  }

  async getUserPowers(userAddress: Address, underlyingAssets: Address[]) {
    const contracts = underlyingAssets.map((asset) =>
      getContract({
        address: asset,
        abi: IAaveTokenV3_ABI,
        client: this.clients[appConfig.govCoreChainId],
      }),
    );

    return await Promise.all(
      contracts.map(async (contract) => {
        const data = await Promise.all([
          await contract.read.balanceOf([userAddress]),
          await contract.read.getPowersCurrent([userAddress]),
          await contract.read.getDelegates([userAddress]),
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
          tokenName: getAssetName(contract.address),
          underlyingAsset: contract.address,
          proposition,
          voting,
        };
      }),
    );
  }

  async getDelegates(underlyingAsset: Address, delegator: Address) {
    const assetContract = getContract({
      address: underlyingAsset,
      abi: IAaveTokenV3_ABI,
      client: this.clients[appConfig.govCoreChainId],
    });
    return await assetContract.read.getDelegates([delegator]);
  }

  async getDelegatedPropositionPower(
    underlyingAssets: Address[],
    user: Address,
  ) {
    const contracts = underlyingAssets.map((asset) =>
      getContract({
        address: asset,
        abi: IAaveTokenV3_ABI,
        client: this.clients[appConfig.govCoreChainId],
      }),
    );

    return Promise.all(
      contracts.map(async (contract) => {
        const power = await contract.read.getPowerCurrent([
          user,
          GovernancePowerType.PROPOSITION,
        ]);

        return {
          underlyingAsset: contract.address,
          delegationPropositionPower: power.toString(),
        };
      }),
    );
  }

  async getDelegatedVotingPowerByBlockHash(
    blockHash: Hex,
    userAddress: Address,
    underlyingAssets: Address[],
  ) {
    const client = this.clients[appConfig.govCoreChainId];
    const blockNumber = await getBlock(client, {
      blockHash,
    });

    const userBalances = await multicall(client, {
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

    const votingPowers = await multicall(client, {
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
        tokenName: getAssetName(asset),
        underlyingAsset: asset,
        basicValue: String(votingPower),
        value: normalizeBN(String(votingPower), 18).toString(),
        userBalance: normalizeBN(String(userBalance), 18).toString(),
        isWithDelegatedPower: userBalance !== votingPower,
      };
    });
  }

  async delegateMetaSig(
    underlyingAsset: Address,
    delegateToAddress: Address,
    delegationType: GovernancePowerTypeApp,
    activeAddress: Address,
    increaseNonce?: boolean,
  ): Promise<BatchMetaDelegateParams | undefined> {
    if (this.wagmiConfig) {
      const deadline = BigInt(Math.floor(Date.now() / 1000 + 3600));
      const isAAAVE =
        underlyingAsset.toLowerCase() ===
        appConfig.additional.aAaveAddress.toLowerCase();
      const isAAVE =
        underlyingAsset.toLowerCase() ===
        appConfig.additional.aaveAddress.toLowerCase();

      const normalAssetContract = getContract({
        address: underlyingAsset,
        abi: IAaveTokenV3_ABI,
        client: this.clients[appConfig.govCoreChainId],
      });
      const aAssetContract = getContract({
        address: underlyingAsset,
        abi: IATokenWithDelegation_ABI,
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
        await signTypedData(this.wagmiConfig, {
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
    const delegateHelperContract = getContract({
      abi: IMetaDelegateHelper_ABI,
      address: appConfig.additional.delegationHelper,
      client: this.clients[appConfig.govCoreChainId],
    });

    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        abi: delegateHelperContract.abi,
        address: delegateHelperContract.address,
        functionName: 'batchMetaDelegate',
        args: [sigs],
        chainId: appConfig.govCoreChainId,
      });
    }
  }

  // need only for gnosis safe wallet
  async delegate(
    underlyingAsset: Address,
    delegateToAddress: Address,
    type: GovernancePowerTypeApp,
  ) {
    if (this.wagmiConfig) {
      if (type === GovernancePowerTypeApp.All) {
        return writeContract(this.wagmiConfig, {
          abi: IAaveTokenV3_ABI,
          address: underlyingAsset,
          functionName: 'delegate',
          args: [delegateToAddress],
          chainId: appConfig.govCoreChainId,
        });
      } else {
        return writeContract(this.wagmiConfig, {
          abi: IAaveTokenV3_ABI,
          address: underlyingAsset,
          functionName: 'delegateByType',
          args: [delegateToAddress, type],
          chainId: appConfig.govCoreChainId,
        });
      }
    }
  }

  getDelegateTxParams(
    delegateToAddress: Address,
    type: GovernancePowerTypeApp,
  ) {
    if (type === GovernancePowerTypeApp.All) {
      return encodeFunctionData({
        abi: IAaveTokenV3_ABI,
        functionName: 'delegate',
        args: [delegateToAddress],
      });
    } else {
      return encodeFunctionData({
        abi: IAaveTokenV3_ABI,
        functionName: 'delegateByType',
        args: [delegateToAddress, type],
      });
    }
  }

  async batchDelegateEIP5792(
    txsData: { to: Address; value: string; data: Hex }[],
  ) {
    if (this.wagmiConfig) {
      return sendCalls(this.wagmiConfig, {
        calls: txsData.map((tx) => ({
          to: tx.to,
          value: BigInt(tx.value),
          data: tx.data,
        })),
      });
    }
  }
}
