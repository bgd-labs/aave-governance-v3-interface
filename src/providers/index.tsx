'use client';

import { HelpModalProvider } from '../components/TutorialModals/HelpModalProvider';
import ThemeRegistry from './ThemeRegistry';
import { TRPCReactProvider } from './TRPCReactProvider';
import WagmiProvider from './WagmiProvider';
import Web3HelperProvider from './Web3HelperProvider';
import { ZustandStoreProvider } from './ZustandStoreProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ZustandStoreProvider>
        <WagmiProvider />
        <Web3HelperProvider />
        <ThemeRegistry options={{ key: 'mui' }}>
          {children}
          <HelpModalProvider />
        </ThemeRegistry>
      </ZustandStoreProvider>
    </TRPCReactProvider>
  );
}
