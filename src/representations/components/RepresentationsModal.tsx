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
  txHash,
  txPending,
  txSuccess,
  txWalletType,
  setIsTxStart,
  setError,
  error,
  isError,
  formData,
  initialData,
  fullTxErrorMessage,
  setFullTxErrorMessage,
}: Pick<
  BasicActionModalProps,
  | 'isOpen'
  | 'setIsOpen'
  | 'isTxStart'
  | 'txHash'
  | 'txPending'
  | 'txSuccess'
  | 'txWalletType'
  | 'setIsTxStart'
  | 'setError'
  | 'isError'
  | 'error'
  | 'fullTxErrorMessage'
  | 'setFullTxErrorMessage'
> & {
  initialData: RepresentationFormData[];
  formData: RepresentationFormData[];
}) {
  return (
    <BasicActionModal
      isTxStart={isTxStart}
      txHash={txHash}
      txPending={txPending}
      txSuccess={txSuccess}
      txWalletType={txWalletType}
      setIsTxStart={setIsTxStart}
      setError={setError}
      error={error}
      isError={isError}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withoutTryAgainWhenError
      fullTxErrorMessage={fullTxErrorMessage}
      setFullTxErrorMessage={setFullTxErrorMessage}
      successElement={<TxText initialData={initialData} formData={formData} />}
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
    </BasicActionModal>
  );
}
