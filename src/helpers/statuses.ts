import { ProposalStateWithName } from '../types';

export type ProposalStateForFilter = {
  value: number | null;
  title: ProposalStateWithName | 'All' | 'Active';
};

export const proposalStatuses = [
  {
    value: 0,
    title: ProposalStateWithName.Created,
  },
  {
    value: 1,
    title: ProposalStateWithName.Voting,
  },
  {
    value: 2,
    title: ProposalStateWithName.Succeed,
  },
  {
    value: 3,
    title: ProposalStateWithName.Failed,
  },
  {
    value: 4,
    title: ProposalStateWithName.Executed,
  },
  {
    value: 5,
    title: ProposalStateWithName.Expired,
  },
  {
    value: 6,
    title: ProposalStateWithName.Canceled,
  },
];

export const proposalStatusesForFilter: ProposalStateForFilter[] = [
  ...proposalStatuses,
  {
    value: 7,
    title: 'Active',
  },
  {
    value: null,
    title: 'All',
  },
];
