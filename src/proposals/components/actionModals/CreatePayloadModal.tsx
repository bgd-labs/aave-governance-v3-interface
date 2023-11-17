import { Box } from '@mui/system';
import React from 'react';

import {
  BasicActionModal,
  BasicActionModalProps,
} from '../../../transactions/components/BasicActionModal';
import { texts } from '../../../ui/utils/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from './ActionModalContentWrapper';

export function CreatePayloadModal({
  isOpen,
  setIsOpen,
  isTxStart,
  tx,
  setIsTxStart,
  setError,
  error,
  payloadId,
  fullTxErrorMessage,
  setFullTxErrorMessage,
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
> & { payloadId: number }) {
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
      successElement={
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.createPayloadSuccess(payloadId)}
        </Box>
      }
      topBlock={
        <ActionModalTitle title={texts.proposalActions.createPayload} />
      }>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.createPayloadDescription(payloadId)}
        </Box>
      </ActionModalContentWrapper>
    </BasicActionModal>
  );
}
