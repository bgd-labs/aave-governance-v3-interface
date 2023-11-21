import React, { useEffect } from 'react';

import { BasicModal } from '../../ui';
import {
  ActionModalContent,
  ActionModalContentProps,
} from './ActionModalContent';

export interface BasicActionModalProps extends ActionModalContentProps {
  isOpen: boolean;
  setFullTxErrorMessage: (value: string) => void;
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
}: BasicActionModalProps) {
  useEffect(() => {
    setIsTxStart(false);
    setError('');
    setFullTxErrorMessage('');
  }, [isOpen]);

  return (
    <BasicModal isOpen={isOpen} setIsOpen={setIsOpen} withCloseButton>
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
