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
  txHash,
  txPending,
  txSuccess,
  txWalletType,
  setIsTxStart,
  setError,
  error,
  isError,
  payloadId,
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
> & { payloadId: number }) {
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
