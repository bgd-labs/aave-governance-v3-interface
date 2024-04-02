'use client';

import { createContext, type ReactNode, useContext, useRef } from 'react';
import { create, type StoreApi, useStore } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createRootSlice, RootState } from './index';

export const RootStoreContext = createContext<StoreApi<RootState> | null>(null);

export interface RootStoreProviderProps {
  children: ReactNode;
}

export const RootStoreProvider = ({ children }: RootStoreProviderProps) => {
  const storeRef = useRef<StoreApi<RootState>>();
  if (!storeRef.current) {
    storeRef.current = create(devtools(createRootSlice, { serialize: true }));
  }

  return (
    <RootStoreContext.Provider value={storeRef.current}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = <T,>(selector: (store: RootState) => T): T => {
  const rootStoreContext = useContext(RootStoreContext);

  if (!rootStoreContext) {
    throw new Error(`useRootStore must be use within RootStoreProvider`);
  }

  return useStore(rootStoreContext, selector);
};
