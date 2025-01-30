import React from 'react';

import { texts } from '../../helpers/texts/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../../transactions/components/ActionModalContentWrapper';
import {
  BasicActionModal,
  BasicActionModalProps,
} from '../../transactions/components/BasicActionModal';
import { RepresentationFormData } from '../../types';
import { TxText } from './TxText';

export function RepresentationsModal({
  isOpen,
  setIsOpen,
  isTxStart,
  setIsTxStart,
  setError,
  error,
  formData,
  initialData,
  fullTxErrorMessage,
  setFullTxErrorMessage,
  tx,
}: Pick<
  BasicActionModalProps,
  | 'isOpen'
  | 'setIsOpen'
  | 'isTxStart'
  | 'setIsTxStart'
  | 'setError'
  | 'error'
  | 'fullTxErrorMessage'
  | 'setFullTxErrorMessage'
  | 'tx'
> & {
  initialData: RepresentationFormData[];
  formData: RepresentationFormData[];
}) {
  return (
    <BasicActionModal
      minHeight={380}
      isTxStart={isTxStart}
      setIsTxStart={setIsTxStart}
      setError={setError}
      error={error}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withoutTryAgainWhenError
      fullTxErrorMessage={fullTxErrorMessage}
      setFullTxErrorMessage={setFullTxErrorMessage}
      tx={tx}
      successElement={<TxText initialData={initialData} formData={formData} />}
      topBlock={
        <ActionModalTitle
          title={
            tx?.isSuccess && isTxStart
              ? texts.representationsPage.txSuccess
              : texts.representationsPage.txTitle
          }
        />
      }>
      <ActionModalContentWrapper>
        <TxText initialData={initialData} formData={formData} isBeforeTx />
      </ActionModalContentWrapper>
    </BasicActionModal>
  );
}
