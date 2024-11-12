import { Address, Chain, Client, Hex } from 'viem';

// ui
export type AppModeType = 'default' | 'dev' | 'expert';
export type IsGaslessVote = 'on' | 'off';

// base
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

export type ProposalToGetUserData = {
  id: bigint;
  votingChainId: number;
  snapshotBlockHash: Hex;
};
// statuses
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

// Initial data
export type InitialData = {
  contractsConstants: ContractsConstants;
  configs: VotingConfig[];
  totalProposalsCount: number;
};

export enum GovernancePowerType {
  VOTING,
  PROPOSITION,
}

// Proposal list
type ProposalOnTheList = {
  proposalId: number;
  title: string;
  state: ProposalState;
  ipfsHash: string;
};

export type ActiveProposalOnTheList = ProposalOnTheList & {
  stateTimestamp: number;
  nextState: ProposalNextState;
  nextStateTimestamp: number;
  pendingState: ProposalPendingState;
  votingChainId: number;
  isVotingActive: boolean;
  isVotingFinished: boolean;
  isFinished: boolean;
  // votes
  forVotes: number;
  requiredForVotes: number;
  forPercent: number;
  againstVotes: number;
  requiredAgainstVotes: number;
  againstPercent: number;
};

export type FinishedProposalOnTheList = ProposalOnTheList & {
  finishedTimestamp: number;
};

export type ProposalItemDataByUser = Pick<ProposalOnTheList, 'proposalId'> & {
  support: boolean;
  votedPower: string;
  isVoted: boolean;
};
// Proposal screen (WIP)

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
