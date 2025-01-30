import { SxProps } from '@mui/system';
import React, { useEffect } from 'react';

import { BasicModal } from '../../components/BasicModal';
import {
  ActionModalContent,
  ActionModalContentProps,
} from './ActionModalContent';

export interface BasicActionModalProps extends ActionModalContentProps {
  isOpen: boolean;
  setFullTxErrorMessage: (value: string) => void;
  withMinHeight?: boolean;
  minHeight?: number;
  contentCss?: SxProps;
}

export function BasicActionModal({
  isOpen,
  setIsOpen,
  topBlock,
  contentMinHeight,
  children,
  isTxStart,
  setIsTxStart,
  error,
  setError,
  successElement,
  withoutTryAgainWhenError,
  fullTxErrorMessage,
  setFullTxErrorMessage,
  tx,
  withMinHeight,
  minHeight,
  contentCss,
}: BasicActionModalProps) {
  useEffect(() => {
    setIsTxStart(false);
    setError('');
    setFullTxErrorMessage('');
  }, [isOpen]);

  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      withMinHeight={withMinHeight}
      contentCss={contentCss}
      minHeight={minHeight}>
      <ActionModalContent
        topBlock={topBlock}
        setIsOpen={setIsOpen}
        isTxStart={isTxStart}
        setIsTxStart={setIsTxStart}
        error={error}
        setError={setError}
        contentMinHeight={contentMinHeight}
        successElement={successElement}
        withoutTryAgainWhenError={withoutTryAgainWhenError}
        fullTxErrorMessage={fullTxErrorMessage}
        tx={tx}>
        {children}
      </ActionModalContent>
    </BasicModal>
  );
}
