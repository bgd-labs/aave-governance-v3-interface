import { IATokenWithDelegation_ABI } from '@bgd-labs/aave-governance-ui-helpers/dist/abis/IATokenWithDelegation';
import { signTypedData } from '@wagmi/core';
import { Address, Client, getContract, hexToSignature } from 'viem';
import { Config } from 'wagmi';

import { appConfig } from '../../configs/appConfig';
import { GovernancePowerTypeApp } from '../../old/web3/services/delegationService';
import { IAaveTokenV3_ABI } from '../../requests/abis/IAaveTokenV3';

export async function delegateMetaSig({
  wagmiConfig,
  underlyingAsset,
  delegateToAddress,
  delegationType,
  activeAddress,
  increaseNonce,
  govCoreClient,
}: {
  wagmiConfig?: Config;
  underlyingAsset: Address;
  delegateToAddress: Address;
  delegationType: GovernancePowerTypeApp;
  activeAddress: Address;
  increaseNonce?: boolean;
  govCoreClient: Client;
}) {
  if (wagmiConfig) {
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
      client: govCoreClient,
    });
    const aAssetContract = getContract({
      address: underlyingAsset,
      abi: IATokenWithDelegation_ABI,
      client: govCoreClient,
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
      await signTypedData(wagmiConfig, {
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
  return undefined;
}
