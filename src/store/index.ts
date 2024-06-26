'use client';

import { IWalletSlice } from '@bgd-labs/frontend-web3-utils';
import { StoreApi } from 'zustand';

import {
  createDelegationSlice,
  IDelegationSlice,
} from '../delegate/store/delegationSlice';
import {
  createPayloadsExplorerSlice,
  IPayloadsExplorerSlice,
} from '../payloadsExplorer/store/payloadsExplorerSlice';
import {
  createProposalCreateOverviewSlice,
  IProposalCreateOverviewSlice,
} from '../proposalCreateOverview/store/proposalCreateOverviewSlice';
import {
  createProposalsHistorySlice,
  IProposalsHistorySlice,
} from '../proposals/store/proposalsHistorySlice';
import {
  createProposalsListCacheSlice,
  IProposalsListCacheSlice,
} from '../proposals/store/proposalsListCacheSlice';
import {
  createProposalsSlice,
  IProposalsSlice,
} from '../proposals/store/proposalsSlice';
import {
  createRepresentationsSlice,
  IRepresentationsSlice,
} from '../representations/store/representationsSlice';
import {
  createRpcSwitcherSlice,
  IRpcSwitcherSlice,
} from '../rpcSwitcher/store/rpcSwitcherSlice';
import {
  createTransactionsSlice,
  TransactionsSlice,
} from '../transactions/store/transactionsSlice';
import { createUISlice, IUISlice } from '../ui/store/uiSlice';
import {
  creationFeesSlice,
  ICreationFeesSlice,
} from '../web3/store/creationFeesSlice';
import { createEnsSlice, IEnsSlice } from '../web3/store/ensSlice';
import { createWeb3Slice, IWeb3Slice } from '../web3/store/web3Slice';
import {
  createPayloadsHelperSlice,
  IPayloadsHelperSlice,
} from './payloadsHelperSlice';

export type RootState = IProposalsSlice &
  IProposalsListCacheSlice &
  IWeb3Slice &
  TransactionsSlice &
  IWalletSlice &
  IDelegationSlice &
  IUISlice &
  IProposalsHistorySlice &
  IRepresentationsSlice &
  IEnsSlice &
  IRpcSwitcherSlice &
  IProposalCreateOverviewSlice &
  IPayloadsExplorerSlice &
  ICreationFeesSlice &
  IPayloadsHelperSlice;

export const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createWeb3Slice(set, get),
  ...createTransactionsSlice(set, get),
  ...createProposalsSlice(set, get),
  ...createProposalsListCacheSlice(set, get),
  ...createDelegationSlice(set, get),
  ...createUISlice(set, get),
  ...createProposalsHistorySlice(set, get),
  ...createRepresentationsSlice(set, get),
  ...createEnsSlice(set, get),
  ...createRpcSwitcherSlice(set, get),
  ...createProposalCreateOverviewSlice(set, get),
  ...createPayloadsExplorerSlice(set, get),
  ...creationFeesSlice(set, get),
  ...createPayloadsHelperSlice(set, get),
});
