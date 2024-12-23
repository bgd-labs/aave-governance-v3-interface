import React, { useEffect, useState } from 'react';

import { texts } from '../../helpers/texts/texts';
import { ActionModalContent } from '../../transactions/components/ActionModalContent';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../../transactions/components/ActionModalContentWrapper';
import { DelegateData, DelegateItem } from '../../types';
import { DelegatedText } from '../Delegate/DelegatedText';
import { getTestTx } from './getTestTx';

interface HelpDelegateTxProps {
  txPending: boolean;
  txSuccess: boolean;
  delegateData: DelegateItem[];
  formDelegateData: DelegateData[];
  handleCancelClick: () => void;
}

export function HelpDelegateTx({
  txPending,
  txSuccess,
  delegateData,
  formDelegateData,
  handleCancelClick,
}: HelpDelegateTxProps) {
  const [error, setError] = useState('');
  const [isTxStart, setIsTxStart] = useState(false);

  useEffect(() => {
    if (txPending) {
      setIsTxStart(true);
    }
  }, [txPending]);

  return (
    <>
      <ActionModalContent
        isTxStart={isTxStart}
        setIsTxStart={setIsTxStart}
        setError={setError}
        error={error}
        setIsOpen={handleCancelClick}
        withoutTryAgainWhenError
        tx={getTestTx({ txPending, txSuccess })}
        successElement={
          <DelegatedText
            delegateData={delegateData}
            formDelegateData={formDelegateData}
          />
        }
        topBlock={
          <ActionModalTitle
            title={
              txSuccess && isTxStart
                ? texts.faq.delegate.delegated
                : texts.faq.delegate.delegation
            }
          />
        }>
        <ActionModalContentWrapper>
          <DelegatedText
            delegateData={delegateData}
            formDelegateData={formDelegateData}
            isBeforeTx
          />
        </ActionModalContentWrapper>
      </ActionModalContent>
    </>
  );
}
