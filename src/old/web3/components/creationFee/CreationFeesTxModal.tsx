import { Box } from '@mui/system';
import React from 'react';

import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../../../proposals/components/actionModals/ActionModalContentWrapper';
import {
  BasicActionModal,
  BasicActionModalProps,
} from '../../../transactions/components/BasicActionModal';
import { texts } from '../../../ui/utils/texts';

export function CreationFeesTxModal({
  isOpen,
  setIsOpen,
  isTxStart,
  setIsTxStart,
  setError,
  error,
  fullTxErrorMessage,
  setFullTxErrorMessage,
  tx,
  proposalIds,
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
  proposalIds: number[];
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
      successElement={
        <Box>
          {texts.creationFee.claimGuaranteeTxInfo(proposalIds.length)}{' '}
          {proposalIds.map((id) => (
            <b key={id}>{id}</b>
          ))}
        </Box>
      }
      topBlock={
        <ActionModalTitle
          title={
            tx?.isSuccess && isTxStart
              ? 'Guarantees claimed'
              : texts.creationFee.title
          }
        />
      }>
      <ActionModalContentWrapper>
        <Box>
          {texts.creationFee.claimGuaranteePreTxInfo(proposalIds.length)}{' '}
          <Box
            sx={{
              '.ReturnFeesTxModal__text': {
                i: {
                  mr: 2,
                },
                '&:last-of-type': {
                  i: {
                    display: 'none',
                  },
                },
              },
            }}>
            {proposalIds.map((id) => (
              <Box
                key={id}
                className="ReturnFeesTxModal__text"
                component="p"
                sx={{ display: 'inline-block' }}>
                <b>{id}</b>
                <i>, </i>
              </Box>
            ))}
          </Box>
        </Box>
      </ActionModalContentWrapper>
    </BasicActionModal>
  );
}
