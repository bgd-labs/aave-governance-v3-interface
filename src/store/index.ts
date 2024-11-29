'use client';

import { StoreApi } from 'zustand';

import { createEnsSlice, IEnsSlice } from './ensSlice';
import {
  createProposalsListSlice,
  IProposalsListSlice,
} from './proposalsListSlice';
import { createProposalsSlice, IProposalsSlice } from './proposalsSlice';
import { createRpcSwitcherSlice, IRpcSwitcherSlice } from './rpcSwitcherSlice';
import {
  createTransactionsSlice,
  TransactionsSlice,
} from './transactionsSlice';
import { createUISlice, IUISlice } from './uiSlice';
import { createWeb3Slice, IWeb3Slice } from './web3Slice';

export type RootState = IUISlice &
  IWeb3Slice &
  TransactionsSlice &
  IEnsSlice &
  IRpcSwitcherSlice &
  IProposalsSlice &
  IProposalsListSlice;

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
});
