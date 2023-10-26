import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { BigButton, BigButtonProps } from '../../ui/components/BigButton';
import { texts } from '../../ui/utils/texts';
import { useLastTxLocalStatus } from '../hooks/useLastTxLocalStatus';
import { TransactionUnion } from '../store/transactionsSlice';
import { BasicActionModal } from './BasicActionModal';

interface ActionModalProps
  extends Pick<BigButtonProps, 'activeColorType'>,
    Pick<TransactionUnion, 'type' | 'payload'> {
  callbackFunction: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  topBlock?: ReactNode;
  contentMinHeight?: number;
  children: ReactNode;
  actionButtonTitle: string;
  withCancelButton?: boolean;
}

export function ActionModal({
  callbackFunction,
  isOpen,
  setIsOpen,
  topBlock,
  contentMinHeight,
  activeColorType,
  children,
  actionButtonTitle,
  withCancelButton,
  type,
  payload,
}: ActionModalProps) {
  const theme = useTheme();

  const {
    error,
    setError,
    loading,
    isTxStart,
    txHash,
    txPending,
    txSuccess,
    setIsTxStart,
    txWalletType,
    isError,
    executeTxWithLocalStatuses,
    fullTxErrorMessage,
    setFullTxErrorMessage,
  } = useLastTxLocalStatus({ type, payload });

  const handleClick = async () =>
    await executeTxWithLocalStatuses({
      callbackFunction,
    });

  return (
    <BasicActionModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      txHash={txHash}
      txSuccess={txSuccess}
      txPending={txPending}
      isTxStart={isTxStart}
      setIsTxStart={setIsTxStart}
      error={error}
      isError={isError}
      setError={setError}
      topBlock={topBlock}
      txWalletType={txWalletType}
      contentMinHeight={contentMinHeight || 240}
      fullTxErrorMessage={fullTxErrorMessage}
      setFullTxErrorMessage={setFullTxErrorMessage}>
      {children}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {withCancelButton && (
          <BigButton
            alwaysWithBorders
            color="white"
            onClick={() => setIsOpen(false)}
            css={{
              mr: withCancelButton ? 24 : 0,
              [theme.breakpoints.up('lg')]: { mr: withCancelButton ? 20 : 0 },
            }}>
            {texts.other.cancel}
          </BigButton>
        )}
        <BigButton
          alwaysWithBorders
          loading={loading}
          activeColorType={activeColorType}
          onClick={() => handleClick()}>
          {actionButtonTitle}
        </BigButton>
      </Box>
    </BasicActionModal>
  );
}
