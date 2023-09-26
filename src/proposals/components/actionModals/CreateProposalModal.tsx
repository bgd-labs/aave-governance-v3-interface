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

export function CreateProposalModal({
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
  proposalId,
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
> & { proposalId: number }) {
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
          {texts.proposalActions.createProposalSuccess(proposalId)}
        </Box>
      }
      topBlock={
        <ActionModalTitle title={texts.proposalActions.createProposal} />
      }>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.createProposalDescription(proposalId)}
        </Box>
      </ActionModalContentWrapper>
    </BasicActionModal>
  );
}
