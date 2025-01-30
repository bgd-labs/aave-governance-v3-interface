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
import { DelegateData, DelegateItem } from '../../types';
import { DelegatedText } from './DelegatedText';

export function DelegateModal({
  isOpen,
  setIsOpen,
  isTxStart,
  setIsTxStart,
  setError,
  error,
  delegateData,
  formDelegateData,
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
> & { delegateData: DelegateItem[]; formDelegateData: DelegateData[] }) {
  return (
    <BasicActionModal
      minHeight={400}
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
      successElement={
        <DelegatedText
          delegateData={delegateData}
          formDelegateData={formDelegateData}
        />
      }
      topBlock={
        <ActionModalTitle
          title={
            tx?.isSuccess && isTxStart
              ? texts.delegatePage.delegateTxSuccess
              : texts.delegatePage.delegateTxTitle
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
    </BasicActionModal>
  );
}
