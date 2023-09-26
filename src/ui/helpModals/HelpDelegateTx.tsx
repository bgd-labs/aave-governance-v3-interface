import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import { DelegatedText } from '../../delegate/components/DelegatedText';
import { DelegateData, DelegateItem } from '../../delegate/types';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../../proposals/components/actionModals/ActionModalContentWrapper';
import { ActionModalContent } from '../../transactions/components/ActionModalContent';
import { texts } from '../utils/texts';

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
        txHash={ethers.constants.AddressZero}
        txPending={txPending}
        txSuccess={txSuccess}
        setIsTxStart={setIsTxStart}
        setError={setError}
        error={error}
        isError={false}
        setIsOpen={handleCancelClick}
        withoutTryAgainWhenError
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
