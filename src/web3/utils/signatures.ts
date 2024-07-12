import { signTypedData } from '@wagmi/core';
import { Hex, hexToSignature } from 'viem';
import { Config } from 'wagmi';

import { appConfig } from '../../utils/appConfig';

export async function getVoteSignatureParams({
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
