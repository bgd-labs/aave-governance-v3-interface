import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { texts } from '../../helpers/texts/texts';
import { useLastTxLocalStatus } from '../../helpers/useLastTxLocalStatus';
import { TransactionUnion } from '../../store/transactionsSlice';
import { BigButton, BigButtonProps } from '../BigButton';
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
    setIsTxStart,
    executeTxWithLocalStatuses,
    fullTxErrorMessage,
    setFullTxErrorMessage,
    tx,
  } = useLastTxLocalStatus({ type, payload });

  const handleClick = async () =>
    await executeTxWithLocalStatuses({
      callbackFunction,
    });

  return (
    <BasicActionModal
      minHeight={380}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isTxStart={isTxStart}
      setIsTxStart={setIsTxStart}
      error={error}
      setError={setError}
      topBlock={topBlock}
      contentMinHeight={contentMinHeight || 240}
      fullTxErrorMessage={fullTxErrorMessage}
      setFullTxErrorMessage={setFullTxErrorMessage}
      tx={tx}>
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
