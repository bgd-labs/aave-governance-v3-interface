import { ProposalStateWithName } from '@bgd-labs/aave-governance-ui-helpers/src';

export type ProposalStateForFilter = {
  value: number | null;
  title: ProposalStateWithName | 'All';
};

export const proposalStatuses = [
  {
    value: 0,
    title: ProposalStateWithName.Created,
  },
  {
    value: 1,
    title: ProposalStateWithName.Active,
  },
  {
    value: 2,
    title: ProposalStateWithName.Succeed,
  },
  {
    value: 3,
    title: ProposalStateWithName.Defeated,
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
  {
    value: 7,
    title: ProposalStateWithName.ActiveAll,
  },
];

export const proposalStatusesForFilter: ProposalStateForFilter[] = [
  ...proposalStatuses,
  {
    value: null,
    title: 'All',
  },
];
