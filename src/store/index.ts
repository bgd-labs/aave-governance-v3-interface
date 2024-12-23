'use client';

import { StoreApi } from 'zustand';

import { creationFeesSlice, ICreationFeesSlice } from './creationFeesSlice';
import { createDelegationSlice, IDelegationSlice } from './delegationSlice';
import { createEnsSlice, IEnsSlice } from './ensSlice';
import {
  createPayloadsExplorerSlice,
  IPayloadsExplorerSlice,
} from './payloadsExplorerSlice';
import {
  createProposalHistorySlice,
  IProposalHistorySlice,
} from './proposalHistorySlice';
import { createProposalSlice, IProposalSlice } from './proposalSlice';
import {
  createProposalsListSlice,
  IProposalsListSlice,
} from './proposalsListSlice';
import { createProposalsSlice, IProposalsSlice } from './proposalsSlice';
import {
  createRepresentationsSlice,
  IRepresentationsSlice,
} from './representationsSlice';
import { createRpcSwitcherSlice, IRpcSwitcherSlice } from './rpcSwitcherSlice';
import {
  createTransactionsSlice,
  TransactionsSlice,
} from './transactionsSlice';
import { createTutorialSlice, ITutorialSlice } from './tutorialSlice';
import { createUISlice, IUISlice } from './uiSlice';
import { createWeb3Slice, IWeb3Slice } from './web3Slice';

export type RootState = IUISlice &
  IWeb3Slice &
  TransactionsSlice &
  IEnsSlice &
  IRpcSwitcherSlice &
  IProposalsSlice &
  IProposalsListSlice &
  IProposalSlice &
  IRepresentationsSlice &
  IDelegationSlice &
  ICreationFeesSlice &
  IProposalHistorySlice &
  IPayloadsExplorerSlice &
  ITutorialSlice;

export const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createUISlice(set, get),
  ...createWeb3Slice(set, get),
  ...createTransactionsSlice(set, get),
  ...createEnsSlice(set, get),
  ...createRpcSwitcherSlice(set, get),
  ...createProposalsSlice(set, get),
  ...createProposalsListSlice(set, get),
  ...createProposalSlice(set, get),
  ...createRepresentationsSlice(set, get),
  ...createDelegationSlice(set, get),
  ...creationFeesSlice(set, get),
  ...createProposalHistorySlice(set, get),
  ...createPayloadsExplorerSlice(set, get),
  ...createTutorialSlice(set, get),
});
