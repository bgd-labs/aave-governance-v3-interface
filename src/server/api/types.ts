import { Address, Hex } from 'viem';

import { InitialPayloadState, InitialProposalState } from '../../types';

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

export type PayloadFromServer = {
  chainId: number;
  payloadId: number;
  creator: string;
  payloadsController: string;
  delay: number;
  state: InitialPayloadState;
  createdAt: number;
  expirationTime: number | null;
  gracePeriod: number;
  maximumAccessLevelRequired: number | null;
  executedAt: number;
  cancelledAt: number;
  queuedAt: number;
  lastUpdatedTimestamp: number;
  createdTxHash: string | null;
  executedTxHash: string | null;
  cancelledTxHash: string | null;
  queuedTxHash: string | null;
  actions: [
    {
      target: string;
      withDelegateCall: boolean;
      accessLevel: number;
      value: number;
      signature: string;
      callData: string;
    },
  ];
};

export type PaginatedPayloadsFromServer = {
  payloads: PayloadFromServer[];
  totalPayloadsCount: [
    {
      count: number;
    },
  ];
};

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
  payloadActions: [
    {
      value: number;
      target: string;
      chainId: number;
      callData: string;
      payloadId: number;
      signature: string;
      accessLevel: number;
      withDelegateCall: boolean;
    },
  ];
  votingStrategyAddress: Address | null;
  votingAssets: Address[] | null;
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
