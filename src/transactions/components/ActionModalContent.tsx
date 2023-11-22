import {
  selectTxExplorerLink,
  TxLocalStatusTxParams,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import LinkIcon from '/public/images/icons/linkIcon.svg';
import RocketError from '/public/images/rocketError.svg';
import RocketReplaced from '/public/images/rocketReplaced.svg';
import RocketSuccess from '/public/images/rocketSuccess.svg';

import { useStore } from '../../store';
import { BigButton, Link } from '../../ui';
import { RocketLoader } from '../../ui/components/RocketLoader';
import { IconBox } from '../../ui/primitives/IconBox';
import { texts } from '../../ui/utils/texts';
import { chainInfoHelper } from '../../utils/configs';
import { TransactionUnion } from '../store/transactionsSlice';
import { CopyErrorButton } from './CopyErrorButton';

export interface ActionModalContentProps {
  topBlock?: ReactNode;
  setIsOpen: (value: boolean) => void;
  contentMinHeight?: number;
  children: ReactNode;
  isTxStart: boolean;
  setIsTxStart: (value: boolean) => void;
  error: Error | string;
  setError: (value: string) => void;
  successElement?: ReactNode;
  closeButtonText?: string;
  withoutTryAgainWhenError?: boolean;
  fullTxErrorMessage?: string;
  tx?: TxLocalStatusTxParams<TransactionUnion>;
}

export function ActionModalContent({
  topBlock,
  setIsOpen,
  contentMinHeight = 240,
  children,
  isTxStart,
  setIsTxStart,
  setError,
  successElement,
  closeButtonText,
  withoutTryAgainWhenError,
  fullTxErrorMessage,
  tx,
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
              {tx?.pending && (
                <Box sx={{ lineHeight: 0, ml: -13 }}>
                  <RocketLoader size={rocketSize} />
                </Box>
              )}
              {tx?.isError && (
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
              {tx?.isSuccess && (
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
              {tx?.isReplaced && (
                <IconBox
                  sx={{
                    width: rocketSize,
                    height: rocketSize,
                    '> svg': {
                      width: rocketSize,
                      height: rocketSize,
                    },
                  }}>
                  <RocketReplaced />
                </IconBox>
              )}

              <Box
                component="h3"
                sx={{
                  typography: 'h3',
                  mb: 8,
                  fontWeight: 600,
                  color: tx?.isError ? '$error' : '$text',
                }}>
                {tx?.pending && texts.transactions.pending}
                {tx?.isSuccess && texts.transactions.success}
                {tx?.isError && texts.transactions.error}
                {tx?.isReplaced && texts.transactions.replaced}
              </Box>
              <Box sx={{ typography: 'h3' }}>
                {tx?.pending && texts.transactions.pendingDescription}
                {tx?.isSuccess && !!successElement
                  ? successElement
                  : tx?.isSuccess && texts.transactions.executed}
                {tx?.isError && texts.transactions.notExecuted}
                {tx?.isReplaced && texts.transactions.txReplaced}
              </Box>
              {tx?.isError && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    my: 12,
                  }}>
                  {fullTxErrorMessage && (
                    <CopyErrorButton errorMessage={fullTxErrorMessage} />
                  )}
                </Box>
              )}
              <Box>
                {tx?.hash && tx?.walletType && (
                  <Box
                    sx={{
                      display: 'flex',
                      mt: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Link
                      href={selectTxExplorerLink(
                        state,
                        chainInfoHelper.getChainParameters,
                        tx.hash,
                      )}
                      css={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: tx.replacedTxHash
                          ? '$textDisabled'
                          : '$textSecondary',
                        path: {
                          transition: 'all 0.2s ease',
                          stroke: tx.replacedTxHash
                            ? theme.palette.$textDisabled
                            : theme.palette.$textSecondary,
                        },
                        hover: {
                          color: tx.replacedTxHash
                            ? theme.palette.$textDisabled
                            : theme.palette.$text,
                          path: {
                            stroke: tx.replacedTxHash
                              ? theme.palette.$textDisabled
                              : theme.palette.$text,
                          },
                        },
                      }}
                      inNewWindow>
                      <Box component="span" sx={{ typography: 'descriptor' }}>
                        {tx.replacedTxHash
                          ? texts.other.transactionHash
                          : texts.other.viewOnExplorer}
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
                {tx?.isReplaced && tx?.replacedTxHash && tx?.hash && (
                  <Box
                    sx={{
                      display: 'flex',
                      mt: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {tx.chainId && (
                      <Link
                        href={selectTxExplorerLink(
                          state,
                          chainInfoHelper.getChainParameters,
                          tx.hash,
                          tx.replacedTxHash,
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
                            path: {
                              stroke: theme.palette.$text,
                            },
                          },
                        }}
                        inNewWindow>
                        <Box component="span" sx={{ typography: 'descriptor' }}>
                          {texts.other.replacedTransactionHash}
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
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {(tx?.isSuccess || tx?.isReplaced) && (
                <BigButton alwaysWithBorders onClick={() => setIsOpen(false)}>
                  {closeButtonText || texts.other.close}
                </BigButton>
              )}
              {tx?.isError && (
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
