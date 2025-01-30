'use client';

import { createContext, ReactNode, useContext, useRef } from 'react';
import { create, StoreApi, useStore as useZustandStore } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createRootSlice, RootState } from '../store';

export const ZustandStoreContext = createContext<StoreApi<RootState> | null>(
  null,
);

export interface ZustandStoreProviderProps {
  children: ReactNode;
}

// provider with zustand store https://docs.pmnd.rs/zustand/guides/nextjs
export const ZustandStoreProvider = ({
  children,
}: ZustandStoreProviderProps) => {
  const storeRef = useRef<StoreApi<RootState> | null>(null);
  if (!storeRef.current) {
    storeRef.current = create(devtools(createRootSlice, { serialize: true }));
  }

  return (
    <ZustandStoreContext.Provider value={storeRef.current}>
      {children}
    </ZustandStoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: RootState) => T): T => {
  const zustandStoreContext = useContext(ZustandStoreContext);

  if (!zustandStoreContext) {
    throw new Error(`useStore must be use within ZustandStoreProvider`);
  }

  return useZustandStore(zustandStoreContext, selector);
};
