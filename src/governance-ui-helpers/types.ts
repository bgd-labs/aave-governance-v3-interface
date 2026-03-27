// enums
import { BigNumber } from 'bignumber.js';
import {
  AbiStateMutability,
  Address,
  Client,
  ContractFunctionReturnType,
  Hex,
} from 'viem';

import { IGovernanceCore_ABI } from './abis/IGovernanceCore';
import { IPayloadsControllerCore_ABI } from './abis/IPayloadsControllerCore';

export enum Asset {
  AAVE = 'AAVE',
  STKAAVE = 'stkAAVE',
  AAAVE = 'aAAVE',
  GOVCORE = 'Gov core',
}

export enum ProposalState {
  Null, // proposal does not exists
  Created, // created, waiting for a cooldown to initiate the balances snapshot
  Active, // balances snapshot set, voting in progress
  Queued, // voting results submitted, but proposal is under grace period when guardian can cancel it
  Executed, // results sent to the execution chain(s)
  Failed, // voting was not successful
  Cancelled, // got cancelled by guardian, or because proposition power of creator dropped below allowed minimum
  Expired,
}

export enum VotingMachineProposalState {
  NotCreated,
  Active,
  Finished,
  SentToGovernance,
}

export enum PayloadState {
  None,
  Created,
  Queued,
  Executed,
  Cancelled,
  Expired,
}

export enum CombineProposalState {
  Created,
  Active,
  Succeed,
  Failed,
  Executed,
  Expired,
  Canceled,
}

export enum ProposalStateWithName {
  Created = 'Created',
  Active = 'Voting',
  Succeed = 'Passed',
  Failed = 'Failed',
  Executed = 'Executed',
  Expired = 'Expired',
  Canceled = 'Canceled',
  ActiveAll = 'Active',
}

export enum ProposalEstimatedState {
  Active = 'Will open for voting',
  Succeed = 'Will pass',
  Failed = 'Will fail',
  ProposalExecuted = 'Proposal will start executing',
  PayloadsExecuted = 'Payloads will start executing',
  Expired = 'Will expire',
}

export enum ProposalWaitForState {
  WaitForActivateVoting = 'Pending voting activation',
  WaitForCloseVoting = 'Pending voting closure',
  WaitForQueueProposal = 'Proposal is time-locked',
  WaitForExecuteProposal = 'Pending proposal execution',
  WaitForQueuePayloads = 'Payloads are time-locked',
  WaitForExecutePayloads = 'Pending payloads execution',
}

export enum HistoryItemType {
  PAYLOADS_CREATED,
  CREATED,
  PROPOSAL_ACTIVATE,
  OPEN_TO_VOTE,
  VOTING_OVER,
  VOTING_CLOSED,
  RESULTS_SENT,
  PROPOSAL_QUEUED,
  PROPOSAL_EXECUTED,
  PAYLOADS_QUEUED,
  PAYLOADS_EXECUTED,
  PROPOSAL_CANCELED,
  PAYLOADS_EXPIRED,
  PROPOSAL_EXPIRED,
}

export type BalanceForProof = {
  underlyingAsset: string;
  value: string;
  userBalance: string;
  isWithDelegatedPower: boolean;
};

export type AssetsBalanceSlots = Record<
  string,
  {
    balance: number;
    delegation?: number;
    exchangeRate?: number;
  }
>;

export type ProposalMetadata = {
  originalIpfsHash: string;
  title: string;
  description: string;
  ipfsHash: string;
  discussions: string;
  author: string;
  snapshot?: string;
};

export type BigNumberValue = string | number | BigNumber;

// types for cache system
/**
 * simple cache mapping:
 * filename:blockNumber with the last used block for caching
 */
export type BookKeepingCache = Record<string, string>;

type ProposalInitialStruct = ContractFunctionReturnType<
  typeof IGovernanceCore_ABI,
  AbiStateMutability,
  'getProposal'
>;
export type ProposalsCache = Record<
  number,
  ProposalInitialStruct & {
    isFinished: boolean; // state when all payloads inside proposal in final state
  }
>;

export type Payload = ContractFunctionReturnType<
  typeof IPayloadsControllerCore_ABI,
  AbiStateMutability,
  'getPayloadById'
> & {
  id: number;
  chainId: number;
  payloadsController: Address | string;
};
export type PayloadsCache = Record<number, Payload>;

// generic
export type ClientsRecord = Record<number, Client>;

export type InitContract = {
  contractAddress: Hex;
  client: Client;
};

export type InitEvent = {
  contractAddress: Hex;
  client: Client;
  startBlock: number;
  endBlock: number;
};

export type InitEventWithChainId = InitEvent & {
  chainId: number;
};
// end

// from contracts
export type ProposalStructOutput = {
  id: bigint;
  votingChainId: bigint;
  proposalData: ProposalInitialStruct;
};

type VMProposalWithoutVotesStructOutput = {
  id: bigint;
  sentToGovernance: boolean;
  startTime: number;
  endTime: number;
  votingClosedAndSentTimestamp: number;
  forVotes: bigint;
  againstVotes: bigint;
  creationBlockNumber: bigint;
  votingClosedAndSentBlockNumber: bigint;
};

export type VMProposalStructOutput = {
  proposalData: Readonly<VMProposalWithoutVotesStructOutput>;
  votedInfo: Readonly<{
    support: boolean;
    votingPower: bigint;
  }>;
  strategy: Hex;
  dataWarehouse: Hex;
  votingAssets: Readonly<Hex[]>;
  hasRequiredRoots: boolean;
  voteConfig: Readonly<{
    votingDuration: number;
    l1ProposalBlockHash: Hex;
  }>;
  state: number;
};
// end

export interface PayloadForCreation {
  chain: bigint;
  accessLevel: number;
  payloadsController: Hex;
  payloadId: number;
}

export type VotersData = {
  proposalId: number;
  address: Hex;
  support: boolean;
  votingPower: number;
  transactionHash: Hex;
  blockNumber: number;
  chainId: number;
  ensName?: string;
};

export type InitialProposal = {
  id: bigint;
  votingChainId: number;
  snapshotBlockHash: Hex;
};

export type VotingMachineData = {
  id: number;
  forVotes: string;
  againstVotes: string;
  startTime: number;
  endTime: number;
  votingClosedAndSentBlockNumber: number;
  votingClosedAndSentTimestamp: number;
  l1BlockHash: Hex;
  strategy: Hex;
  sentToGovernance: boolean;
  createdBlock: number;
  votedInfo: {
    support: boolean;
    votingPower: string;
  };
  votingAssets: Readonly<Hex[]>;
  hasRequiredRoots: boolean;
};

// type for create payload actions
export type PayloadAction = {
  payloadAddress: Hex;
  withDelegateCall: boolean;
  accessLevel: number;
  value: number;
  signature: string;
  callData?: string;
};

export type VotingConfig = {
  accessLevel: number;
  quorum: number;
  differential: number;
  minPropositionPower: number;
  coolDownBeforeVotingStart: number;
  votingDuration: number;
};

export type ContractsConstants = {
  precisionDivider: string;
  cooldownPeriod: number;
  expirationTime: number;
  cancellationFee: string;
};

export type InitialPayload = {
  id: number;
  chainId: number;
  payloadsController: Address | string;
};

export interface BasicProposal {
  id: number;
  votingDuration: number;
  creationTime: number;
  accessLevel: number;
  state: ProposalState;
  queuingTime: number;
  ipfsHash: string;
  initialPayloads: InitialPayload[];
  votingMachineData: VotingMachineData;
  snapshotBlockHash: string;
  creator: string;
  canceledAt: number;
  votingActivationTime: number;
  votingChainId: number;
  isFinished: boolean;
  lastUpdatedTimestamp?: number;
  cancellationFee: number;
}

export interface ProposalData
  extends BasicProposal,
    Pick<ProposalMetadata, 'title'> {
  payloads: Payload[];
  votingMachineState: VotingMachineProposalState;
}

type BlockHash = string;
export type Balance = {
  blockHash: Hex;
  tokenName: string;
  underlyingAsset: Hex;
  value: string;
  basicValue: string;
  userBalance: string;
  isWithDelegatedPower: boolean;
};

export type VotingBalance = Record<BlockHash, Balance[]>;

export interface ProposalWithoutState {
  data: ProposalData;
  precisionDivider: string;
  config: VotingConfig;
  timings: {
    cooldownPeriod: number;
    expirationTime: number;
    executionDelay: number;
  };
  balances: Balance[];
}

export interface Proposal extends ProposalWithoutState {
  combineState: CombineProposalState;
}

export interface ProposalWithLoadings {
  loading: boolean;
  balanceLoading: boolean;
  proposal: Proposal;
}

export interface ProposalWithId extends ProposalWithLoadings {
  id: number;
}

export interface FinishedProposalForList
  extends Pick<ProposalMetadata, 'title'> {
  id: number;
  combineState: CombineProposalState;
  finishedTimestamp: number;
  ipfsHash: string;
}

export enum CreationFeeState {
  LATER,
  AVAILABLE,
  RETURNED,
  NOT_AVAILABLE,
}

export type CreationFee = {
  proposalId: number;
  proposalStatus: CombineProposalState;
  ipfsHash: string;
  status: CreationFeeState;
  title: string;
};

export interface CachedProposalDataItem {
  proposal: {
    data: {
      id: number;
      finishedTimestamp: number;
      title: string;
      ipfsHash: string;
    };
    combineState: CombineProposalState;
  };
}

export interface CachedProposalDataItemWithId extends CachedProposalDataItem {
  id: number;
}

export interface CachedDetails {
  payloads: Payload[];
  ipfs: ProposalMetadata;
  proposal: BasicProposal;
}

export type FilteredEvent = {
  transactionHash: string;
};

export type TxInfo = {
  id: number;
  hash: string;
  chainId: number;
  hashLoading: boolean;
};

export type ProposalHistoryItem = {
  type: HistoryItemType;
  title: string;
  txInfo: TxInfo;
  timestamp?: number;
  addresses?: string[];
};
