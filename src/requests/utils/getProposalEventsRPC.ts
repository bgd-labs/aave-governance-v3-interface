import {
  IGovernanceCore_ABI,
  IPayloadsControllerCore_ABI,
  IVotingMachineWithProofs_ABI,
} from '@bgd-labs/aave-address-book/abis';
import { zeroAddress, zeroHash } from 'viem';
import { getContractEvents } from 'viem/actions';

import {
  blockLimit,
  getEventsBySteps,
  InitEvent,
  InitEventWithChainId,
} from './eventsHelpers';

// payloads created
async function getPayloadsCreatedEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
  chainId,
}: InitEventWithChainId) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IPayloadsControllerCore_ABI,
    eventName: 'PayloadCreated',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      creator: event.args.creator,
      payloadId: event.args.payloadId,
      chainId,
      transactionHash: event.transactionHash,
      blockNumber: Number(event.blockNumber),
      payloadsController: contractAddress,
    }));
}

export async function getPayloadsCreated({
  contractAddress,
  client,
  startBlock,
  endBlock,
  chainId,
}: InitEventWithChainId) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getPayloadsCreatedEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
      chainId,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      creator: zeroAddress,
      payloadId: -1,
      chainId,
      transactionHash: zeroHash,
      blockNumber: startBlock,
      payloadsController: contractAddress,
    },
  ]);
}

// proposal created
async function getProposalCreatedEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IGovernanceCore_ABI,
    eventName: 'ProposalCreated',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      proposalId: Number(event.args.proposalId),
      transactionHash: event.transactionHash,
      blockNumber: Number(event.blockNumber),
    }));
}

export async function getProposalCreated({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getProposalCreatedEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      proposalId: -1,
      transactionHash: zeroHash,
      blockNumber: startBlock,
    },
  ]);
}

// proposal activate for voting
async function getProposalActivatedEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IGovernanceCore_ABI,
    eventName: 'VotingActivated',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      proposalId: Number(event.args.proposalId),
      transactionHash: event.transactionHash,
      blockNumber: Number(event.blockNumber),
    }));
}

export async function getProposalActivated({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getProposalActivatedEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      proposalId: -1,
      transactionHash: zeroHash,
      blockNumber: startBlock,
    },
  ]);
}

// voting activate on VM
async function getProposalActivatedOnVMEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IVotingMachineWithProofs_ABI,
    eventName: 'ProposalVoteStarted',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      proposalId: Number(event.args.proposalId),
      transactionHash: event.transactionHash,
      blockNumber: Number(event.blockNumber),
    }));
}

export async function getProposalActivatedOnVM({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getProposalActivatedOnVMEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      proposalId: -1,
      transactionHash: zeroHash,
      blockNumber: startBlock,
    },
  ]);
}

// voting closed on VM and voting results sent
async function getProposalVotingClosedEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IVotingMachineWithProofs_ABI,
    eventName: 'ProposalResultsSent',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      proposalId: Number(event.args.proposalId),
      transactionHash: event.transactionHash,
      blockNumber: Number(event.blockNumber),
    }));
}

export async function getProposalVotingClosed({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getProposalVotingClosedEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      proposalId: -1,
      transactionHash: zeroHash,
      blockNumber: startBlock,
    },
  ]);
}

// proposal queued
async function getProposalQueuedEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IGovernanceCore_ABI,
    eventName: 'ProposalQueued',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      proposalId: Number(event.args.proposalId),
      transactionHash: event.transactionHash,
      blockNumber: Number(event.blockNumber),
    }));
}

export async function getProposalQueued({
  contractAddress,
  client,
  startBlock,
  endBlock,
}: InitEvent) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getProposalQueuedEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      proposalId: -1,
      transactionHash: zeroHash,
      blockNumber: startBlock,
    },
  ]);
}

// payloads queued
async function getPayloadsQueuedEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
  chainId,
}: InitEventWithChainId) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IPayloadsControllerCore_ABI,
    eventName: 'PayloadQueued',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      payloadId: event.args.payloadId,
      chainId,
      transactionHash: event.transactionHash,
      blockNumber: Number(event.blockNumber),
      payloadsController: contractAddress,
    }));
}

export async function getPayloadsQueued({
  contractAddress,
  client,
  startBlock,
  endBlock,
  chainId,
}: InitEventWithChainId) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getPayloadsQueuedEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
      chainId,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      payloadId: -1,
      chainId,
      transactionHash: zeroHash,
      blockNumber: startBlock,
      payloadsController: contractAddress,
    },
  ]);
}

// payloads executed
async function getPayloadsExecutedEvents({
  contractAddress,
  client,
  startBlock,
  endBlock,
  chainId,
}: InitEventWithChainId) {
  const events = await getContractEvents(client, {
    address: contractAddress,
    abi: IPayloadsControllerCore_ABI,
    eventName: 'PayloadExecuted',
    fromBlock: BigInt(startBlock),
    toBlock: BigInt(endBlock),
  });

  return events
    .sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber))
    .map((event) => ({
      payloadId: event.args.payloadId,
      chainId,
      transactionHash: event.transactionHash,
      blockNumber: Number(event.blockNumber),
      payloadsController: contractAddress,
    }));
}

export async function getPayloadsExecuted({
  contractAddress,
  client,
  startBlock,
  endBlock,
  chainId,
}: InitEventWithChainId) {
  const callbackFunc = async (
    startBlockNumber: number,
    endBlockNumber: number,
  ) => {
    return await getPayloadsExecutedEvents({
      contractAddress,
      client,
      startBlock: startBlockNumber,
      endBlock: endBlockNumber,
      chainId,
    });
  };

  return getEventsBySteps(startBlock, endBlock, blockLimit, callbackFunc, [
    {
      payloadId: -1,
      chainId,
      transactionHash: zeroHash,
      blockNumber: startBlock,
      payloadsController: contractAddress,
    },
  ]);
}
