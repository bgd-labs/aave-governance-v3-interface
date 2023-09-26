'use client';

import { create, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createUISlice, IUISlice } from '../ui/store/uiSlice';

export type RootState = IUISlice;

const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createUISlice(set, get),
});

export const useStore = create(devtools(createRootSlice, { serialize: true }));
