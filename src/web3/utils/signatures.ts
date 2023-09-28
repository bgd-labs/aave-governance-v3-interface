import { ethers } from 'ethers';

import { IVotingMachineWithProofs } from '../../contracts/IVotingMachineWithProofs';
import { appConfig } from '../../utils/appConfig';

export async function getVoteSignatureParams({
  signer,
  votingChainId,
  proposalId,
  voterAddress,
  representativeAddress,
  support,
  votingAssetsWithSlot,
}: {
  signer: ethers.providers.JsonRpcSigner;
  votingChainId: number;
  proposalId: number;
  voterAddress: string;
  representativeAddress?: string;
  support: boolean;
  votingAssetsWithSlot: { underlyingAsset: string; slot: number }[];
}) {
  const domain = {
    name: 'Aave Voting Machine',
    version: 'V1',
    chainId: votingChainId,
    verifyingContract:
      appConfig.votingMachineConfig[votingChainId].contractAddress,
  };

  if (!!representativeAddress) {
    const sig = ethers.utils.splitSignature(
      await signer._signTypedData(
        domain,
        {
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
        {
          proposalId,
          voter: voterAddress,
          representative: representativeAddress,
          support,
          votingAssetsWithSlot,
        },
      ),
    );

    return {
      v: sig.v,
      r: sig.r,
      s: sig.s,
    } as IVotingMachineWithProofs.SignatureParamsStruct;
  } else {
    const signerAddress = await signer.getAddress();
    console.log('sig voter address', voterAddress);
    console.log('sig signer address', signerAddress);
    const sig = ethers.utils.splitSignature(
      await signer._signTypedData(
        domain,
        {
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
        {
          proposalId,
          voter: voterAddress,
          support,
          votingAssetsWithSlot,
        },
      ),
    );

    const signatureAddress = ethers.utils.verifyTypedData(
      domain,
      {
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
      {
        proposalId,
        voter: voterAddress,
        support,
        votingAssetsWithSlot,
      },
      sig,
    );

    console.log('sig signature address', signatureAddress);

    return {
      v: sig.v,
      r: sig.r,
      s: sig.s,
    } as IVotingMachineWithProofs.SignatureParamsStruct;
  }
}
