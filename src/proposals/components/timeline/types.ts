import { ProposalStateWithName } from '@bgd-labs/aave-governance-ui-helpers';

export interface TimelineItemType {
  title: string;
  position?: number;
  finished: boolean;
  type: TimelineItemTypeType;
  timestamp: number;
  timestampForEstimatedState?: number;
  visibility?: boolean;
  state?: ProposalStateWithName;
  color?:
    | 'achieved'
    | 'regular'
    | 'bigRegular'
    | 'bigSuccess'
    | 'bigError'
    | 'bigCanceled';
  rocketVisible?: boolean;
}

export enum TimelineItemTypeType {
  created = 'created',
  openToVote = 'openToVote',
  votingClosed = 'votingClosed',
  finished = 'Finished',
}
