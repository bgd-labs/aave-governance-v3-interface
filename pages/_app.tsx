import 'react-loading-skeleton/dist/skeleton.css';

import { EmotionCache } from '@emotion/cache';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { AppGlobalStyles } from '../src/ui';
import AppLayout from '../src/ui/layouts/AppLayout';
import WagmiProvider from '../src/web3/providers/WagmiProvider';

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
      <WagmiProvider />

      <AppGlobalStyles emotionCache={emotionCache}>
        <AppLayout>{getLayout(<Component {...pageProps} />)}</AppLayout>
      </AppGlobalStyles>
    </>
  );
}

export default GovernanceApp;
