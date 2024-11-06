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

// need only for active proposals
export type ProposalItemDataByWallet = Pick<ProposalOnTheList, 'proposalId'> & {
  votingPower: string;
  votedInfo: { support: boolean; votedPower: string };
  isVoted: boolean;
};

// Proposal screen (WIP)
