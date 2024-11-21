import { Box } from '@mui/system';
import React from 'react';

import { texts } from '../../helpers/texts/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../Transactions/ActionModalContentWrapper';
import {
  BasicActionModal,
  BasicActionModalProps,
} from '../Transactions/BasicActionModal';

export function CreateProposalModal({
  isOpen,
  setIsOpen,
  isTxStart,
  setIsTxStart,
  setError,
  error,
  proposalId,
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
> & { proposalId: number }) {
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
