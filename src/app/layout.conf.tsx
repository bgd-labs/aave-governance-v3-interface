import NextTopLoader from 'nextjs-toploader';
import { ReactNode } from 'react';

import AppLayout from '../components/layouts/AppLayout';
import { isForIPFS } from '../configs/appConfig';
import Providers from '../providers';

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL(`http://localhost:${process.env.PORT || 3000}`),
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const { pathname } = typeof window !== 'undefined' ? window.location : {};
  const ipfsMatch = RegExp('/.*\\/Qm\\w{44}\\//').exec(pathname ?? '');

  return (
    <html suppressHydrationWarning lang="en">
      {isForIPFS && (
        <head>
          <base href={ipfsMatch ? ipfsMatch[0] : '/'} />
        </head>
      )}

      <body>
        <NextTopLoader />
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
