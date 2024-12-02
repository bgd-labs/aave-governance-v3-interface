import {
  IGovernanceCore_ABI,
  IPayloadsControllerDataHelper_ABI,
  IVotingMachineDataHelper_ABI,
} from '@bgd-labs/aave-address-book/abis';
import {
  AbiStateMutability,
  Address,
  Chain,
  Client,
  ContractFunctionReturnType,
  Hex,
} from 'viem';

import { formatDataForDetails } from './requests/utils/formatProposalData';

// ui
export type AppModeType = 'default' | 'dev' | 'expert';
export type IsGaslessVote = 'on' | 'off';

// base
export type ProposalInitialStruct = ContractFunctionReturnType<
  typeof IGovernanceCore_ABI,
  AbiStateMutability,
  'getProposal'
> & {
  id: number;
  title?: string;
  ipfsError?: string;
};
export type PayloadInitialStruct = ContractFunctionReturnType<
  typeof IPayloadsControllerDataHelper_ABI,
  AbiStateMutability,
  'getPayloadsData'
>[0] & {
  id: bigint;
  chain: bigint;
  payloadsController: Address;
};
export type VMProposalInitialStruct = ContractFunctionReturnType<
  typeof IVotingMachineDataHelper_ABI,
  AbiStateMutability,
  'getProposalsData'
>[0] & {
  votingChainId: number;
};

export type VotingConfig = {
  accessLevel: number;
  quorum: bigint;
  differential: bigint;
  minPropositionPower: bigint;
  coolDownBeforeVotingStart: number;
  votingDuration: number;
};

export type ContractsConstants = {
  precisionDivider: bigint;
  cooldownPeriod: bigint;
  expirationTime: bigint;
  cancellationFee: bigint;
};

export type ProposalToGetUserData = {
  id: bigint;
  votingChainId: number;
  snapshotBlockHash: Hex;
};

export type PayloadAction = {
  payloadAddress: Address;
  withDelegateCall: boolean;
  accessLevel: number;
  value: number;
  signature: string;
  callData?: string;
};
// statuses
export enum InitialProposalState {
  Null, // proposal does not exists
  Created, // created, waiting for a cooldown to initiate the balances snapshot
  Active, // balances snapshot set, voting in progress
  Queued, // voting results submitted, but proposal is under grace period when guardian can cancel it
  Executed, // results sent to the execution chain(s)
  Failed, // voting was not successful
  Cancelled, // got cancelled by guardian, or because proposition power of creator dropped below allowed minimum
  Expired,
}

export enum InitialPayloadState {
  None,
  Created,
  Queued,
  Executed,
  Cancelled,
  Expired,
}

export enum ProposalState {
  Created,
  Voting,
  Succeed,
  Failed,
  Executed,
  Expired,
  Canceled,
}

export enum ProposalStateWithName {
  Created = 'Created',
  Voting = 'Voting',
  Succeed = 'Passed',
  Failed = 'Failed',
  Executed = 'Executed',
  Expired = 'Expired',
  Canceled = 'Canceled',
}

export enum ProposalNextState {
  Voting = 'Will open for voting',
  Succeed = 'Will pass',
  Failed = 'Will fail',
  ProposalExecuted = 'Proposal will start executing',
  PayloadsExecuted = 'Payloads will start executing',
  Expired = 'Will expire',
}

export enum ProposalPendingState {
  WaitForActivateVoting = 'Pending voting activation',
  WaitForCloseVoting = 'Pending voting closure',
  WaitForQueueProposal = 'Proposal is time-locked',
  WaitForExecuteProposal = 'Pending proposal execution',
  WaitForQueuePayloads = 'Payloads are time-locked',
  WaitForExecutePayloads = 'Pending payloads execution',
}

export enum GovernancePowerType {
  VOTING,
  PROPOSITION,
}

export type ProposalMetadata = {
  title: string;
  description: string;
  ipfsHash: string;
  discussions: string;
  author: string;
  snapshot?: string;
};

// Proposal list
export type ProposalOnTheList = {
  proposalId: number;
  title: string;
  ipfsHash: string;
  state: {
    state: ProposalState;
    timestamp: number;
  };
};

export type ActiveProposalOnTheList = ProposalOnTheList & {
  nextState: {
    state: ProposalNextState;
    timestamp: number;
  };
  pendingState?: ProposalPendingState;
  votingChainId: number;
  isVotingActive: boolean;
  isVotingFinished: boolean;
  snapshotBlockHash: string;
  votingAssets: string[];
  isFinished: boolean;
  // votes
  forVotes: number;
  requiredForVotes: number;
  forPercent: number;
  againstVotes: number;
  requiredAgainstVotes: number;
  againstPercent: number;
  isActive?: boolean;
  ipfsError?: string;
};
// Proposal data by user
export type VotedDataByUser = {
  proposalId: bigint;
  votedInfo: { support: boolean; votedPower: bigint };
  isVoted: boolean;
};

export type VotingDataByUser = {
  blockHash: string;
  asset: string;
  votingPower: bigint;
  userBalance: bigint;
  isWithDelegatedPower: boolean;
};
// Proposal details
export type DetailedProposalData = {
  proposalData: ProposalInitialStruct;
  payloadsData: PayloadInitialStruct[];
  votingData: VMProposalInitialStruct;
  metadata: ProposalMetadata;
  formattedData: ReturnType<typeof formatDataForDetails>;
  ipfsError?: string;
};

// ENS
export enum ENSProperty {
  NAME = 'name',
  AVATAR = 'avatar',
}

export type EnsDataItem = {
  name?: string;
  avatar?: {
    url?: string;
    isExists?: boolean;
  };
  fetched?: {
    name?: number;
    avatar?: number;
  };
};

// RPC switching
export type AppClient = {
  instance: Client;
  rpcUrl: string;
};

export type RpcSwitcherFormData = { chainId: number; rpcUrl: string }[];

export type AppClientsStorage = Omit<AppClient, 'instance'>;

export type ChainInfo = {
  clientInstances: Record<number, { instance: Client }>;
  getChainParameters: (chainId: number) => Chain;
};

export type SetRpcErrorParams = {
  isError: boolean;
  rpcUrl: string;
  chainId: number;
};

// representation
export type RepresentativeAddress = {
  chainsIds: number[];
  address: Address | '';
};

export type RepresentedAddress = { chainId: number; address: Address | '' };

// create proposal
export type CreateProposalPageParams = {
  payloadsCount: Record<string, number>;
  accessLevels: number[];
  proposalsCount: number;
  payloadsAvailableIds: Record<string, number[]>;
  cancellationFee: string;
  proposalsData: ProposalInitialStruct[];
};

// create proposal overview
export type PayloadWithHashes = PayloadInitialStruct & {
  proposalId?: number;
  seatbeltMD?: string;
  creator?: Address;
  createdTransactionHash?: string;
  queuedTransactionHash?: string;
  executedTransactionHash?: string;
  isError?: boolean;
};

// requests
export type GetPayloadsData = {
  chainId: number;
  payloadsIds: number[];
  clients: Record<number, Client>;
};

export type GetProposalsData = {
  proposalsCount?: number;
  proposalsIds?: number[];
  clients: Record<number, Client>;
};
