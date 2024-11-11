'use client';

import 'nprogress/nprogress.css';

import React, { useEffect } from 'react';

import {
  isForIPFS,
  isTermsAndConditionsVisible,
} from '../../configs/appConfig';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TermsAndConditionsModal } from '../TermsAndConditionsModal';
import { TermsPreAppModal } from '../TermsPreAppModal';
import { MainLayout } from './MainLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const checkIsAppBlockedByTerms = useStore(
    (store) => store.checkIsAppBlockedByTerms,
  );
  const checkTutorialStartButtonClick = useStore(
    (store) => store.checkTutorialStartButtonClick,
  );

  useEffect(() => {
    checkTutorialStartButtonClick();
    checkIsAppBlockedByTerms();
  }, []);

  return (
    <>
      <MainLayout>{children}</MainLayout>

      {!isForIPFS && isTermsAndConditionsVisible && (
        <>
          <TermsAndConditionsModal />
          <TermsPreAppModal />
        </>
      )}
    </>
  );
}
