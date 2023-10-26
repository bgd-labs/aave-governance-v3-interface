import { WalletClient } from '@wagmi/core';
import { Hex, hexToSignature, signatureToHex, verifyTypedData } from 'viem';

import { appConfig } from '../../utils/appConfig';

export async function getVoteSignatureParams({
  walletClient,
  votingChainId,
  proposalId,
  voterAddress,
  representativeAddress,
  support,
  votingAssetsWithSlot,
}: {
  walletClient: WalletClient;
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

  if (!!representativeAddress) {
    const sig = hexToSignature(
      await walletClient.signTypedData({
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
    const signerAddress = walletClient.account.address;
    console.log('sig voter address', voterAddress);
    console.log('sig signer address', signerAddress);
    const sig = hexToSignature(
      await walletClient.signTypedData({
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

    // TODO: remove after testing
    const signatureAddress = await verifyTypedData({
      address: signerAddress,
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
      signature: signatureToHex(sig),
    });

    console.log('sig signature address', signatureAddress);

    return {
      v: sig.v,
      r: sig.r,
      s: sig.s,
    };
  }
}
