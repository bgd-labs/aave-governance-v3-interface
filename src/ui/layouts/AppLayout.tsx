'use client';

import 'react-loading-skeleton/dist/skeleton.css';
import 'nprogress/nprogress.css';

import Router from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';

import { RepresentationInfoModal } from '../../representations/components/RepresentationInfoModal';
import { useStore } from '../../store';
import { isForIPFS } from '../../utils/appConfig';
import Web3Provider from '../../web3/components/Web3Provider';
import Web3HelperProvider from '../../web3/providers/Web3HelperProvider';
import { TermsAndConditionsModal } from '../components/TermsAndConditionsModal';
import { TermsPreAppModal } from '../components/TermsPreAppModal';
import { HelpModalProvider } from '../helpModals/HelpModalProvider';
import { MainLayout } from './MainLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { checkIsAppBlockedByTerms } = useStore();

  useEffect(() => {
    checkIsAppBlockedByTerms();
  }, []);

  if (isForIPFS) {
    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());
  }

  return (
    <>
      <Web3Provider />
      <Web3HelperProvider />
      <MainLayout>{children}</MainLayout>

      <HelpModalProvider />
      <RepresentationInfoModal />

      {!isForIPFS && (
        <>
          <TermsAndConditionsModal />
          <TermsPreAppModal />
        </>
      )}
    </>
  );
}
