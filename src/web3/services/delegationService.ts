'use client';

import { normalizeBN } from '@bgd-labs/aave-governance-ui-helpers/src';
import { AaveTokenV3__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/AaveTokenV3__factory';
import { ATokenWithDelegation__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/ATokenWithDelegation__factory';
import { IMetaDelegateHelper__factory } from '@bgd-labs/aave-governance-ui-helpers/src/contracts/IMetaDelegateHelper__factory';
import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils/src';
import { ethers, providers } from 'ethers';

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

export type BatchMetaDelegateParams = {
  underlyingAsset: string;
  delegator: string;
  delegatee: string;
  deadline: string;
  v: number;
  r: string;
  s: string;
  delegationType: GovernancePowerTypeApp;
};

export class DelegationService {
  private signer: providers.JsonRpcSigner | undefined;
  private providers: Record<
    number,
    StaticJsonRpcBatchProvider | ethers.providers.JsonRpcProvider
  >;

  constructor(
    providers: Record<
      number,
      StaticJsonRpcBatchProvider | ethers.providers.JsonRpcProvider
    >,
  ) {
    this.providers = providers;
  }

  connectSigner(signer: providers.JsonRpcSigner) {
    this.signer = signer;
  }

  async getDelegates(underlyingAsset: string, delegator: string) {
    const assetContract = AaveTokenV3__factory.connect(
      underlyingAsset,
      this.providers[appConfig.govCoreChainId],
    );

    return await Promise.all([
      await assetContract.getDelegateeByType(
        delegator,
        GovernancePowerType.VOTING,
      ),
      await assetContract.getDelegateeByType(
        delegator,
        GovernancePowerType.PROPOSITION,
      ),
    ]);
  }

  async getDelegatedPropositionPower(underlyingAssets: string[], user: string) {
    const contracts = underlyingAssets.map((asset) => {
      return {
        contract: AaveTokenV3__factory.connect(
          asset,
          this.providers[appConfig.govCoreChainId],
        ),
        underlyingAsset: asset,
      };
    });

    return Promise.all(
      contracts.map(async (contract) => {
        const power = await contract.contract.getPowerCurrent(
          user,
          GovernancePowerType.PROPOSITION,
        );

        return {
          underlyingAsset: contract.underlyingAsset,
          delegationPropositionPower: power.toString(),
        };
      }),
    );
  }

  async getDelegatedVotingPowerByBlockHash(
    blockHash: string,
    userAddress: string,
    underlyingAssets: string[],
  ) {
    const blockNumber = (
      await this.providers[appConfig.govCoreChainId].getBlock(blockHash)
    ).number;
    const contracts = underlyingAssets.map((asset) => {
      return {
        contract: AaveTokenV3__factory.connect(
          asset,
          this.providers[appConfig.govCoreChainId],
        ),
        underlyingAsset: asset,
      };
    });

    return Promise.all(
      contracts.map(async (contract) => {
        const userBalance = await contract.contract.balanceOf(userAddress);
        const totalPower = await contract.contract.getPowerCurrent(
          userAddress,
          GovernancePowerType.VOTING,
          {
            blockTag: blockNumber,
          },
        );

        return {
          blockHash,
          tokenName: getTokenName(contract.underlyingAsset),
          underlyingAsset: contract.underlyingAsset,
          basicValue: totalPower.toString(),
          value: normalizeBN(totalPower.toString(), 18).toString(),
          userBalance: userBalance.toString(),
          isWithDelegatedPower: userBalance.lt(totalPower),
        };
      }),
    );
  }

  async delegateMetaSig(
    underlyingAsset: string,
    delegateToAddress: string,
    delegationType: GovernancePowerTypeApp,
    activeAddress: string,
    increaseNonce?: boolean,
  ): Promise<BatchMetaDelegateParams | undefined> {
    if (this.signer) {
      const deadline = Math.floor(Date.now() / 1000 + 3600).toString();
      const isAAAVE =
        underlyingAsset.toLowerCase() ===
        appConfig.additional.aAaveAddress.toLowerCase();
      const isAAVE =
        underlyingAsset.toLowerCase() ===
        appConfig.additional.aaveAddress.toLowerCase();

      const normalAssetContract = AaveTokenV3__factory.connect(
        underlyingAsset,
        this.providers[appConfig.govCoreChainId],
      );
      const aAssetContract = ATokenWithDelegation__factory.connect(
        underlyingAsset,
        this.providers[appConfig.govCoreChainId],
      );

      // TODO: maybe need fix name
      // const name = isAAAVE
      //   ? await aAssetContract.name()
      //   : await normalAssetContract.name();

      const name = isAAAVE
        ? 'Aave Ethereum AAVE'
        : isAAVE
        ? 'Aave token V3'
        : await normalAssetContract.name();

      const nonce = isAAAVE
        ? await aAssetContract.nonces(activeAddress)
        : await normalAssetContract._nonces(activeAddress);

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
        nonce: increaseNonce ? nonce.add(1) : nonce,
        deadline,
      };

      const sig = ethers.utils.splitSignature(
        await this.signer._signTypedData(
          {
            name: name,
            version: '2',
            chainId: appConfig.govCoreChainId,
            verifyingContract: underlyingAsset,
          },
          isAllDelegate
            ? { Delegate: [...sigParametersType, ...sigBaseType] }
            : {
                DelegateByType: [
                  ...sigParametersType,
                  ...sigDelegationTypeType,
                  ...sigBaseType,
                ],
              },
          isAllDelegate
            ? {
                ...typesData,
              }
            : { ...typesData, delegationType },
        ),
      );

      return {
        underlyingAsset,
        delegator: activeAddress,
        delegatee: delegateToAddress,
        delegationType,
        deadline,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      };
    }
  }

  async batchMetaDelegate(sigs: BatchMetaDelegateParams[]) {
    const delegateHelperContract = IMetaDelegateHelper__factory.connect(
      appConfig.additional.delegationHelper,
      this.providers[appConfig.govCoreChainId],
    );

    // TODO: maybe don't need to increase gas limit for mainnets
    const gasLimit =
      await delegateHelperContract.estimateGas.batchMetaDelegate(sigs);

    if (this.signer) {
      return delegateHelperContract
        .connect(this.signer)
        .batchMetaDelegate(sigs, {
          gasLimit: gasLimit.add(100000),
        });
    } else {
      return delegateHelperContract.batchMetaDelegate(sigs, {
        gasLimit: gasLimit.add(100000),
      });
    }
  }
}
