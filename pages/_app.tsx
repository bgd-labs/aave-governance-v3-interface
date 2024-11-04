import 'react-loading-skeleton/dist/skeleton.css';

import { EmotionCache } from '@emotion/cache';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { ZustandStoreProvider } from '../src/old/store/ZustandStoreProvider';
import { AppGlobalStyles } from '../src/old/ui';
import AppLayout from '../src/old/ui/layouts/AppLayout';
import WagmiProvider from '../src/old/web3/providers/WagmiProvider';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface GovernanceAppProps extends AppProps {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
}

function GovernanceApp({
  Component,
  pageProps,
  emotionCache,
}: GovernanceAppProps) {
  const router = useRouter();

  const getLayout = Component.getLayout ?? ((page: React.ReactNode) => page);

  useMemo(() => {
    router.prefetch = async () => {};
  }, [router]);

  return (
    <>
      <ZustandStoreProvider>
        <WagmiProvider />

        <AppGlobalStyles emotionCache={emotionCache}>
          <AppLayout>{getLayout(<Component {...pageProps} />)}</AppLayout>
        </AppGlobalStyles>
      </ZustandStoreProvider>
    </>
  );
}

export default GovernanceApp;
