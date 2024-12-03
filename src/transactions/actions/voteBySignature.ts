import { IVotingMachineWithProofs_ABI } from '@bgd-labs/aave-address-book/abis';
import {
  GelatoRelay,
  SponsoredCallRequest,
} from '@gelatonetwork/relay-sdk-viem';
import { BaseRelayParams } from '@gelatonetwork/relay-sdk-viem/dist/lib/types';
import { signTypedData } from '@wagmi/core';
import { Address, encodeFunctionData, Hex, hexToSignature } from 'viem';
import { Config } from 'wagmi';

import { appConfig, gelatoApiKeys } from '../../configs/appConfig';

async function getVoteSignatureParams({
  wagmiConfig,
  votingChainId,
  proposalId,
  voterAddress,
  representativeAddress,
  support,
  votingAssetsWithSlot,
}: {
  wagmiConfig: Config;
  votingChainId: number;
  proposalId: number;
  voterAddress: Hex;
  representativeAddress?: Hex;
  support: boolean;
  votingAssetsWithSlot: { underlyingAsset: Hex; slot: number }[];
}) {
  const domain = {
    name: 'Aave Voting Machine',
    version: 'V1',
    chainId: votingChainId,
    verifyingContract:
      appConfig.votingMachineConfig[votingChainId].contractAddress,
  };

  if (representativeAddress) {
    const sig = hexToSignature(
      await signTypedData(wagmiConfig, {
        domain,
        types: {
          VotingAssetWithSlot: [
            { name: 'underlyingAsset', type: 'address' },
            { name: 'slot', type: 'uint128' },
          ],
          SubmitVoteAsRepresentative: [
            {
              name: 'proposalId',
              type: 'uint256',
            },
            {
              name: 'voter',
              type: 'address',
            },
            {
              name: 'representative',
              type: 'address',
            },
            {
              name: 'support',
              type: 'bool',
            },
            {
              name: 'votingAssetsWithSlot',
              type: 'VotingAssetWithSlot[]',
            },
          ],
        },
        primaryType: 'SubmitVoteAsRepresentative',
        message: {
          proposalId: BigInt(proposalId),
          voter: voterAddress,
          representative: representativeAddress,
          support,
          votingAssetsWithSlot: votingAssetsWithSlot.map((asset) => {
            return {
              slot: BigInt(asset.slot),
              underlyingAsset: asset.underlyingAsset,
            };
          }),
        },
      }),
    );

    return {
      v: sig.v,
      r: sig.r,
      s: sig.s,
    };
  } else {
    const sig = hexToSignature(
      await signTypedData(wagmiConfig, {
        domain,
        types: {
          VotingAssetWithSlot: [
            { name: 'underlyingAsset', type: 'address' },
            { name: 'slot', type: 'uint128' },
          ],
          SubmitVote: [
            {
              name: 'proposalId',
              type: 'uint256',
            },
            {
              name: 'voter',
              type: 'address',
            },
            {
              name: 'support',
              type: 'bool',
            },
            {
              name: 'votingAssetsWithSlot',
              type: 'VotingAssetWithSlot[]',
            },
          ],
        },
        primaryType: 'SubmitVote',
        message: {
          proposalId: BigInt(proposalId),
          voter: voterAddress,
          support,
          votingAssetsWithSlot: votingAssetsWithSlot.map((asset) => {
            return {
              slot: BigInt(asset.slot),
              underlyingAsset: asset.underlyingAsset,
            };
          }),
        },
      }),
    );

    return {
      v: sig.v,
      r: sig.r,
      s: sig.s,
    };
  }
}

export async function voteBySignature({
  wagmiConfig,
  votingChainId,
  proposalId,
  support,
  votingAssetsWithSlot,
  proofs,
  signerAddress,
  voterAddress,
  proofOfRepresentation,
}: {
  wagmiConfig?: Config;
  votingChainId: number;
  proposalId: number;
  support: boolean;
  votingAssetsWithSlot: { underlyingAsset: Address; slot: number }[];
  proofs: {
    underlyingAsset: Address;
    slot: bigint;
    proof: Hex;
  }[];
  signerAddress: Address;
  voterAddress?: Address;
  proofOfRepresentation?: Hex;
}) {
  const relay = new GelatoRelay();

  if (wagmiConfig) {
    const signatureParams = voterAddress
      ? await getVoteSignatureParams({
          wagmiConfig,
          votingChainId,
          proposalId,
          voterAddress,
          representativeAddress: signerAddress,
          support,
          votingAssetsWithSlot,
        })
      : await getVoteSignatureParams({
          wagmiConfig,
          votingChainId,
          proposalId,
          voterAddress: signerAddress,
          support,
          votingAssetsWithSlot,
        });

    const gelatoApiKey = gelatoApiKeys[votingChainId];

    const data =
      !!voterAddress && !!proofOfRepresentation
        ? encodeFunctionData({
            abi: IVotingMachineWithProofs_ABI,
            functionName: 'submitVoteAsRepresentativeBySignature',
            args: [
              BigInt(proposalId),
              voterAddress,
              signerAddress,
              support,
              proofOfRepresentation,
              proofs,
              {
                ...signatureParams,
                v: Number(signatureParams.v),
              },
            ],
          })
        : encodeFunctionData({
            abi: IVotingMachineWithProofs_ABI,
            functionName: 'submitVoteBySignature',
            args: [
              BigInt(proposalId),
              signerAddress,
              support,
              proofs,
              Number(signatureParams.v),
              signatureParams.r,
              signatureParams.s,
            ],
          });

    const request: SponsoredCallRequest = {
      chainId: BigInt(votingChainId),
      target: appConfig.votingMachineConfig[votingChainId].contractAddress,
      data: data as BaseRelayParams['data'],
    };

    return relay.sponsoredCall(request, gelatoApiKey);
  }
  return undefined;
}
