'use client';

import { createContext, type ReactNode, useContext, useRef } from 'react';
import { create, type StoreApi, useStore as useZustandStore } from 'zustand';
import { devtools } from 'zustand/middleware';

import { createRootSlice, RootState } from './index';

// provider with zustand store https://docs.pmnd.rs/zustand/guides/nextjs
export const ZustandStoreContext = createContext<StoreApi<RootState> | null>(
  null,
);

export interface ZustandStoreProviderProps {
  children: ReactNode;
}

export const ZustandStoreProvider = ({
  children,
}: ZustandStoreProviderProps) => {
  const storeRef = useRef<StoreApi<RootState>>();

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
