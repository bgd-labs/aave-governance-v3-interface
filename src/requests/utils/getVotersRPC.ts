import { IVotingMachineWithProofs_ABI } from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { Address, formatUnits, Hex, zeroAddress, zeroHash } from 'viem';
import { getBlockNumber, getContractEvents } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { DECIMALS } from '../../configs/configs';
import { VotersData } from '../../types';
import {
  blockLimit,
  getBlocksForEvents,
  getEventsBySteps,
  InitEventWithChainId,
} from './eventsHelpers';

export type GetVotersRPC = {
  votingChainId: number;
  startBlockNumber: number;
  endBlockNumber?: number;
  lastBlockNumber?: number;
  clients: ClientsRecord;
};

async function getVoteEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
  chainId,
}: InitEventWithChainId) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IVotingMachineWithProofs_ABI,
    eventName: 'VoteEmitted',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      proposalId: Number(event.args.proposalId),
      address: (event.args.voter || '').toString() as Address,
      support: event.args.support || false,
      votingPower: Number(formatUnits(event.args.votingPower || 0n, DECIMALS)),
      transactionHash: event.transactionHash as Hex,
      blockNumber: Number(event.blockNumber),
      chainId,
    }));
}

async function getVoters({
  contractAddress,
  client,
  endBlock,
  startBlock,
  blockLimit,
  chainId,
}: InitEventWithChainId & { blockLimit: number }) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getVoteEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
      chainId,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      proposalId: -1,
      address: zeroAddress,
      support: false,
      votingPower: 0,
      transactionHash: zeroHash,
      blockNumber: startBlock,
      chainId,
    },
  ]);
}

export async function getVotersRPC({
  votingChainId,
  startBlockNumber,
  endBlockNumber,
  lastBlockNumber,
  clients,
}: GetVotersRPC) {
  const currentBlock = (await getBlockNumber(clients[votingChainId])) || 0;

  const { startBlock, endBlock } = getBlocksForEvents(
    Number(currentBlock),
    startBlockNumber,
    endBlockNumber,
    lastBlockNumber,
  );

  const voters: VotersData[] = [];

  if (endBlock) {
    const newVoters = await getVoters({
      contractAddress:
        appConfig.votingMachineConfig[votingChainId].contractAddress,
      client: clients[votingChainId],
      endBlock,
      startBlock,
      blockLimit,
      chainId: votingChainId,
    });

    voters.push(...newVoters);
  }

  return voters;
}
