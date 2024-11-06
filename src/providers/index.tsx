'use client';

import ThemeRegistry from './ThemeRegistry';
import { TRPCReactProvider } from './TRPCReactProvider';
import { ZustandStoreProvider } from './ZustandStoreProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ZustandStoreProvider>
        <ThemeRegistry options={{ key: 'mui' }}>{children}</ThemeRegistry>
      </ZustandStoreProvider>
    </TRPCReactProvider>
  );
}
