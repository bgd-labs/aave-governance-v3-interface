import React from 'react';

import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../../proposals/components/actionModals/ActionModalContentWrapper';
import {
  BasicActionModal,
  BasicActionModalProps,
} from '../../transactions/components/BasicActionModal';
import { texts } from '../../ui/utils/texts';
import { RepresentationFormData } from '../store/representationsSlice';
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
