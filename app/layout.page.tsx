import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';

import { RootStoreProvider } from '../src/store/storeProvider';
import AppLayout from '../src/ui/layouts/AppLayout';
import ThemeRegistry from '../src/ui/utils/ThemeRegistry';
import WagmiProvider from '../src/web3/providers/WagmiProvider';

export const interNextFont = Inter({
  weight: ['300', '400', '600', '700', '800'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`,
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <RootStoreProvider>
          <WagmiProvider />

          <ThemeRegistry options={{ key: 'mui' }}>
            <NextTopLoader />
            <AppLayout>{children}</AppLayout>
          </ThemeRegistry>
        </RootStoreProvider>
      </body>
    </html>
  );
}
