import { IVotingMachineDataHelper_ABI } from '@bgd-labs/aave-address-book';
import { Address, Client, getContract, zeroAddress } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { ProposalToGetUserData } from '../../types';

export type GetVotingData = {
  initialProposals: ProposalToGetUserData[];
  userAddress?: string;
  clients: Record<number, Client>;
  representativeAddress?: string;
};

export async function getVotingData({
  initialProposals,
  userAddress,
  representativeAddress,
  clients,
}: GetVotingData) {
  const votingMachineChainIds = initialProposals
    .map((data) => data.votingChainId)
    .filter((value, index, self) => self.indexOf(value) === index);

  const data = await Promise.all(
    votingMachineChainIds.map(async (chainId) => {
      const votingMachineDataHelper = getContract({
        abi: IVotingMachineDataHelper_ABI,
        address:
          appConfig.votingMachineConfig[chainId].dataHelperContractAddress,
        client: clients[chainId],
      });

      const formattedInitialProposals = initialProposals
        .filter((proposal) => proposal.votingChainId === chainId)
        .map((proposal) => {
          return {
            id: proposal.id,
            snapshotBlockHash: proposal.snapshotBlockHash,
          };
        });

      if (representativeAddress && userAddress) {
        if (userAddress) {
          return (
            (await votingMachineDataHelper.read.getProposalsData([
              appConfig.votingMachineConfig[chainId].contractAddress,
              formattedInitialProposals,
              (representativeAddress || userAddress || zeroAddress) as Address,
            ])) || []
          );
        }
      }
      return (
        (await votingMachineDataHelper.read.getProposalsData([
          appConfig.votingMachineConfig[chainId].contractAddress,
          formattedInitialProposals,
          (userAddress || zeroAddress) as Address,
        ])) || []
      );
    }),
  );

  return data.flat();
}
