import {
  selectTxExplorerLink,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import LinkIcon from '/public/images/icons/linkIcon.svg';
import RocketError from '/public/images/rocketError.svg';
import RocketSuccess from '/public/images/rocketSuccess.svg';

import { useStore } from '../../store';
import { BigButton, Link } from '../../ui';
import { RocketLoader } from '../../ui/components/RocketLoader';
import { IconBox } from '../../ui/primitives/IconBox';
import { texts } from '../../ui/utils/texts';
import { chainInfoHelper } from '../../utils/configs';
import { CopyErrorButton } from './CopyErrorButton';

export interface ActionModalContentProps {
  topBlock?: ReactNode;
  setIsOpen: (value: boolean) => void;
  contentMinHeight?: number;
  children: ReactNode;
  txHash?: string;
  txWalletType?: WalletType;
  txPending?: boolean;
  txSuccess?: boolean;
  isTxStart: boolean;
  setIsTxStart: (value: boolean) => void;
  error: Error | string;
  setError: (value: string) => void;
  isError?: boolean;
  successElement?: ReactNode;
  closeButtonText?: string;
  withoutTryAgainWhenError?: boolean;
  fullTxErrorMessage?: Error | string;
}

export function ActionModalContent({
  topBlock,
  setIsOpen,
  contentMinHeight = 240,
  children,
  txHash,
  txWalletType,
  txPending,
  txSuccess,
  isTxStart,
  setIsTxStart,
  error,
  setError,
  isError,
  successElement,
  closeButtonText,
  withoutTryAgainWhenError,
  fullTxErrorMessage,
}: ActionModalContentProps) {
  const theme = useTheme();
  const state = useStore();

  const rocketSize = 77;

  return (
    <>
      {topBlock}

      <Box
        sx={{
          display: 'flex',
          minHeight: contentMinHeight,
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        {isTxStart ? (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                flex: 1,
                py: 20,
                flexDirection: 'column',
              }}>
              {txPending && (
                <Box sx={{ lineHeight: 0, ml: -13 }}>
                  <RocketLoader size={rocketSize} />
                </Box>
              )}
              {isError && (
                <IconBox
                  sx={{
                    width: rocketSize,
                    height: rocketSize,
                    '> svg': {
                      width: rocketSize,
                      height: rocketSize,
                    },
                  }}>
                  <RocketError />
                </IconBox>
              )}
              {txSuccess && (
                <IconBox
                  sx={{
                    width: rocketSize,
                    height: rocketSize,
                    '> svg': {
                      width: rocketSize,
                      height: rocketSize,
                    },
                  }}>
                  <RocketSuccess />
                </IconBox>
              )}

              <Box
                component="h3"
                sx={{
                  typography: 'h3',
                  mb: 8,
                  fontWeight: 600,
                  color: isError ? '$error' : '$text',
                }}>
                {txPending && texts.transactions.pending}
                {txSuccess && texts.transactions.success}
                {isError && texts.transactions.error}
              </Box>
              <Box sx={{ typography: 'h3' }}>
                {txPending && texts.transactions.pendingDescription}
                {txSuccess && !!successElement
                  ? successElement
                  : txSuccess && texts.transactions.executed}
                {isError && texts.transactions.notExecuted}
              </Box>
              {isError && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    my: 12,
                  }}>
                  {/*<Box*/}
                  {/*  sx={{*/}
                  {/*    typography: 'body',*/}
                  {/*    color: '$textSecondary',*/}
                  {/*    wordBreak: 'break-all',*/}
                  {/*  }}>*/}
                  {/*  {error}*/}
                  {/*</Box>*/}
                  {fullTxErrorMessage && (
                    <CopyErrorButton errorMessage={fullTxErrorMessage} />
                  )}
                </Box>
              )}
              {txHash && txWalletType && (
                <Box
                  sx={{
                    display: 'flex',
                    mt: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Link
                    href={selectTxExplorerLink(
                      state,
                      chainInfoHelper.getChainParameters,
                      txHash,
                    )}
                    css={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '$textSecondary',
                      path: {
                        transition: 'all 0.2s ease',
                        stroke: theme.palette.$textSecondary,
                      },
                      hover: {
                        color: theme.palette.$text,
                        path: { stroke: theme.palette.$text },
                      },
                    }}
                    inNewWindow>
                    <Box component="span" sx={{ typography: 'descriptor' }}>
                      {texts.other.viewOnExplorer}
                    </Box>
                    <IconBox
                      sx={{
                        width: 12,
                        height: 12,
                        '> svg': {
                          width: 12,
                          height: 12,
                        },
                        ml: 4,
                        position: 'relative',
                      }}>
                      <LinkIcon />
                    </IconBox>
                  </Link>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {txSuccess && (
                <BigButton alwaysWithBorders onClick={() => setIsOpen(false)}>
                  {closeButtonText || texts.other.close}
                </BigButton>
              )}
              {isError && (
                <>
                  <BigButton
                    alwaysWithBorders
                    color="white"
                    css={{ mr: withoutTryAgainWhenError ? 0 : 20 }}
                    onClick={() => setIsOpen(false)}>
                    {closeButtonText || texts.other.close}
                  </BigButton>
                  {!withoutTryAgainWhenError && (
                    <BigButton
                      alwaysWithBorders
                      onClick={() => {
                        setIsTxStart(false);
                        setError('');
                      }}>
                      {texts.transactions.tryAgain}
                    </BigButton>
                  )}
                </>
              )}
            </Box>
          </>
        ) : (
          <>{children}</>
        )}
      </Box>
    </>
  );
}
