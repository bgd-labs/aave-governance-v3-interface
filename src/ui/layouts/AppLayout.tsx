'use client';

import 'react-loading-skeleton/dist/skeleton.css';
import 'nprogress/nprogress.css';

import Router from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';

import { useStore } from '../../store';
import { isForIPFS } from '../../utils/appConfig';
import { TermsAndConditionsModal } from '../components/TermsAndConditionsModal';
import { TermsPreAppModal } from '../components/TermsPreAppModal';
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
      <MainLayout>{children}</MainLayout>

      {!isForIPFS && (
        <>
          <TermsAndConditionsModal />
          <TermsPreAppModal />
        </>
      )}
    </>
  );
}
