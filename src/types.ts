import {
  IGovernanceCore_ABI,
  IPayloadsControllerDataHelper_ABI,
  IVotingMachineDataHelper_ABI,
} from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
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

export type InitialPayload = {
  id: number;
  chainId: number;
  payloadsController: string;
};

export type PayloadAction = {
  payloadAddress: Address;
  withDelegateCall: boolean;
  accessLevel: number;
  value: number;
  signature: string;
  callData?: string;
};

export enum Asset {
  AAVE = 'AAVE',
  STKAAVE = 'stkAAVE',
  AAAVE = 'aAAVE',
  GOVCORE = 'Gov core',
}
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

export enum ProposalStateForFilters {
  Created,
  Voting,
  Succeed,
  Failed,
  Executed,
  Expired,
  Canceled,
  Active,
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

export enum GovernancePowerTypeApp {
  VOTING,
  PROPOSITION,
  All,
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
  payloadsData: PayloadWithHashes[];
  votingData: VMProposalInitialStruct;
  metadata: ProposalMetadata;
  formattedData: ReturnType<typeof formatDataForDetails>;
  ipfsError?: string;
  eventsHashes?: {
    createdTxHash: string | null;
    executedTxHash: string | null;
    cancelledTxHash: string | null;
    queuedTxHash: string | null;
    failedTxHash: string | null;
    votingActivatedTxHash: string | null;
  };
};

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

// history events
export enum HistoryItemType {
  PAYLOADS_CREATED = 0,
  CREATED = 1,
  PROPOSAL_ACTIVATE = 2,
  OPEN_TO_VOTE = 3,
  VOTING_OVER = 4,
  VOTING_CLOSED = 5,
  RESULTS_SENT = 6,
  PROPOSAL_QUEUED = 7,
  PROPOSAL_EXECUTED = 8,
  PAYLOADS_QUEUED = 9,
  PAYLOADS_EXECUTED = 10,
  PROPOSAL_CANCELED = 11,
  PAYLOADS_EXPIRED = 12,
  PROPOSAL_EXPIRED = 13,
}

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

export type FilteredEvent = {
  transactionHash: string;
};

// User powers
export type PowerByAsset = {
  userBalance: bigint;
  totalPower: bigint;
  delegatedPower: bigint;
  isWithDelegatedPower: boolean;
};

export type PowersByAssets = Record<
  Hex,
  {
    tokenName: string;
    underlyingAsset: Hex;
    proposition: PowerByAsset;
    voting: PowerByAsset;
  }
>;

export type CurrentPower = {
  timestamp: number;
  totalPropositionPower: number;
  totalVotingPower: number;
  yourPropositionPower: number;
  yourVotingPower: number;
  delegatedPropositionPower: number;
  delegatedVotingPower: number;
  powersByAssets: PowersByAssets;
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
export type RepresentationDataItem = {
  representative: Address | '';
  represented: Address[];
};

export type RepresentationFormData = {
  chainId: number;
  representative: Address | '';
};

export type RepresentativeAddress = {
  chainsIds: number[];
  address: Address | '';
};

export type RepresentedAddress = { chainId: number; address: Address | '' };

// delegation
export type DelegateItem = {
  underlyingAsset: Address;
  symbol: Asset;
  amount: number;
  votingToAddress: Address | string;
  propositionToAddress: Address | string;
};

export type DelegateData = {
  underlyingAsset: Address;
  votingToAddress: Address | string;
  propositionToAddress: Address | string;
};

export type TxDelegateData = {
  symbol: Asset;
  underlyingAsset: Address;
  bothAddresses?: Address | string;
  votingToAddress?: Address | string;
  propositionToAddress?: Address | string;
};

export type DelegateDataParams = {
  underlyingAsset: Address;
  delegator: Address;
  delegatee: Address;
  delegationType: GovernancePowerTypeApp;
  increaseNonce?: boolean;
};

export type BatchMetaDelegateParams = {
  underlyingAsset: Address;
  delegator: Address;
  delegatee: Address;
  deadline: bigint;
  v: number;
  r: Hex;
  s: Hex;
  delegationType: GovernancePowerTypeApp;
};

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

// creation fee return
export enum CreationFeeState {
  LATER,
  AVAILABLE,
  RETURNED,
  NOT_AVAILABLE,
}

export type CreationFee = {
  proposalId: number;
  proposalStatus: ProposalState;
  ipfsHash: string;
  status: CreationFeeState;
  title: string;
};

// requests
export type GetPayloadsData = {
  chainId: number;
  payloadsIds: number[];
  clients: ClientsRecord;
};

export type GetProposalsData = {
  proposalsCount?: number;
  proposalsIds?: number[];
  clients: ClientsRecord;
};

// From server
export type ConstantsFromServer = [
  {
    COOLDOWN_PERIOD: number;
    CANCELLATION_FEE: string;
    PROPOSAL_EXPIRATION_TIME: number;
    PRECISION_DIVIDER: string;
  },
];

export type ConfigsFromServer = {
  coolDownBeforeVotingStart: number;
  votingDuration: number;
  yesThreshold: number;
  yesNoDifferential: number;
  minPropositionPower: number;
  accessLevel: number;
}[];

export type GetProposalInitialResponse = {
  proposalId: number;
  state: InitialProposalState;
  accessLevel: number;
  creationTime: number;
  votingActivationTime: number | null;
  queuingTime: number | null;
  cancelTimestamp: number | null;
  creator: Address;
  votingPortal: Address;
  snapshotBlockHash: Hex;
  ipfsHash: Hex;
  forVotes: string | null;
  againstVotes: string | null;
  cancellationFee: string | null;
  createdTxHash: Hex | null;
  executedTxHash: Hex | null;
  cancelledTxHash: Hex | null;
  queuedTxHash: Hex | null;
  failedTxHash: Hex | null;
  votingActivatedTxHash: Hex | null;
  executedTimestamp: number | null;
  failedTimestamp: number | null;
  title: string | null;
  votingChainId: number;
  votingStartTime: number | null;
  votingEndTime: number | null;
  votingCreationBlockNumber: number | null;
  votingProposalState: number | null;
  votingClosedAndSentBlockNumber: number | null;
  votingClosedAndSentTimestamp: number | null;
  sentToGovernance: boolean | null;
  votingDuration: number;
  l1ProposalBlockHash: Hex | null;
  hasRequiredRoots: boolean | null;
  votingForVotes: string | null;
  votingAgainstVotes: string | null;
  payloads: [
    {
      chainId: number;
      creator: Address;
      payloadId: number;
      payloadsController: Address;
      delay: number;
      state: InitialPayloadState;
      createdAt: number;
      expirationTime: number | null;
      gracePeriod: number;
      maximumAccessLevelRequired: number;
      executedAt: number | null;
      cancelledAt: number | null;
      queuedAt: number | null;
      lastUpdatedTimestamp: number;
    },
  ];
};

export type GetGovernanceProposalsResponse = {
  proposals: GetProposalInitialResponse[];
  totalProposalsCount: [
    {
      count: number | null;
    },
  ];
};

export type RepresentativeItem = {
  representationChainId: number;
  representative: Address;
  represented: Address;
  lastUpdatedTimestamp: number;
};

export type VoterAPI = {
  voter: Address;
  support: boolean;
  votingPower: number;
  txHash: Hex;
  lastUpdatedTimestamp: number;
};

export type FeesDataAPI = {
  state: InitialProposalState;
  accessLevel: number;
  creationTime: number;
  votingDuration: number;
  votingActivationTime: number | null;
  queuingTime: number | null;
  cancelTimestamp: number | null;
  creator: Address;
  votingPortal: Address;
  snapshotBlockHash: Hex;
  ipfsHash: Hex;
  forVotes: string;
  againstVotes: string;
  cancellationFee: string;
  createdTxHash: Hex | null;
  executedTxHash: Hex | null;
  cancelledTxHash: Hex | null;
  queuedTxHash: Hex | null;
  failedTxHash: Hex | null;
  votingActivatedTxHash: Hex | null;
  executedTimestamp: number;
  failedTimestamp: Hex | null;
  proposalId: number;
  title: string;
};
