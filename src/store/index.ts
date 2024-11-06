'use client';

import { StoreApi } from 'zustand';

import { createUISlice, IUISlice } from './uiSlice';

export type RootState = IUISlice;

export const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createUISlice(set, get),
});
