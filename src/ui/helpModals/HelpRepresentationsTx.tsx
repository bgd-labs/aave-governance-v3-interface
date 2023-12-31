import React, { useEffect, useState } from 'react';

import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../../proposals/components/actionModals/ActionModalContentWrapper';
import { TxText } from '../../representations/components/TxText';
import { RepresentationFormData } from '../../representations/store/representationsSlice';
import { ActionModalContent } from '../../transactions/components/ActionModalContent';
import { texts } from '../utils/texts';
import { getTestTx } from './getTestTx';

interface HelpRepresentationsTxProps {
  txPending: boolean;
  txSuccess: boolean;
  initialData: RepresentationFormData[];
  formData: RepresentationFormData[];
  handleCancelClick: () => void;
}

export function HelpRepresentationsTx({
  txPending,
  txSuccess,
  formData,
  initialData,
  handleCancelClick,
}: HelpRepresentationsTxProps) {
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
          <TxText initialData={initialData} formData={formData} />
        }
        topBlock={
          <ActionModalTitle
            title={
              txSuccess && isTxStart
                ? texts.representationsPage.txSuccess
                : texts.representationsPage.txTitle
            }
          />
        }>
        <ActionModalContentWrapper>
          <TxText initialData={initialData} formData={formData} isBeforeTx />
        </ActionModalContentWrapper>
      </ActionModalContent>
    </>
  );
}
