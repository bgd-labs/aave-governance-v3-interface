import { IVotingMachineDataHelper_ABI } from '@bgd-labs/aave-address-book/abis';
import { Address, Client, getContract, zeroAddress } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { ProposalToGetUserData } from '../../types';

export type GetVotingDataRPC = {
  initialProposals: ProposalToGetUserData[];
  walletAddress?: string;
  clients: Record<number, Client>;
};

export async function getVotingDataRPC({
  initialProposals,
  walletAddress,
  clients,
}: GetVotingDataRPC) {
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

      const data = await votingMachineDataHelper.read.getProposalsData([
        appConfig.votingMachineConfig[chainId].contractAddress,
        formattedInitialProposals,
        (walletAddress ?? zeroAddress) as Address,
      ]);

      return data.map((votingData) => {
        return {
          ...votingData,
          votingChainId: chainId,
        };
      });
    }),
  );

  return data.flat();
}
