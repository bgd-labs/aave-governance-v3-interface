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
  txHash,
  txPending,
  txSuccess,
  isTxStart,
  setIsTxStart,
  isError,
  error,
  setError,
  successElement,
  txWalletType,
  withoutTryAgainWhenError,
  fullTxErrorMessage,
  setFullTxErrorMessage,
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
        isError={isError}
        error={error}
        setError={setError}
        contentMinHeight={contentMinHeight}
        successElement={successElement}
        txSuccess={txSuccess}
        txHash={txHash}
        txPending={txPending}
        txWalletType={txWalletType}
        withoutTryAgainWhenError={withoutTryAgainWhenError}
        fullTxErrorMessage={fullTxErrorMessage}>
        {children}
      </ActionModalContent>
    </BasicModal>
  );
}
