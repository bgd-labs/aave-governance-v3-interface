import { Box } from '@mui/system';
import React from 'react';

import { texts } from '../../../helpers/texts/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../ActionModalContentWrapper';
import { BasicActionModal, BasicActionModalProps } from '../BasicActionModal';

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
  proposalsIds,
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
  proposalsIds: number[];
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
          {texts.creationFee.claimGuaranteeTxInfo(proposalsIds.length)}{' '}
          {proposalsIds.map((id) => (
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
          {texts.creationFee.claimGuaranteePreTxInfo(proposalsIds.length)}{' '}
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
            {proposalsIds.map((id) => (
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
