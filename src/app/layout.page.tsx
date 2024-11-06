import NextTopLoader from 'nextjs-toploader';
import React from 'react';

import AppLayout from '../components/layouts/AppLayout';
import Providers from '../providers';

export const metadata = {
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
        <Providers>
          <NextTopLoader />
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
