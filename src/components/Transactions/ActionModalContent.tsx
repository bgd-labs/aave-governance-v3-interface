import {
  selectTxExplorerLink,
  TxLocalStatusTxParams,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import LinkIcon from '../../assets/icons/linkIcon.svg';
import RocketError from '../../assets/rocketError.svg';
import RocketReplaced from '../../assets/rocketReplaced.svg';
import RocketSuccess from '../../assets/rocketSuccess.svg';
import { chainInfoHelper } from '../../configs/configs';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TransactionUnion } from '../../store/transactionsSlice';
import { BigButton } from '../BigButton';
import { Link } from '../Link';
import { IconBox } from '../primitives/IconBox';
import { RocketLoader } from '../RocketLoader';
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
  const transactionsPool = useStore((store) => store.transactionsPool);

  const rocketSize = 77;

  const isFinalStatus =
    !tx?.pending && (tx?.isError || tx?.isSuccess || tx?.isReplaced);

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
                py: 24,
                flexDirection: 'column',
                position: 'relative',
                top: !isFinalStatus ? 30 : 0,
                [theme.breakpoints.up('lg')]: {
                  py: 40,
                },
              }}>
              <Box
                sx={{
                  minHeight: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
              </Box>

              <Box
                component="h3"
                sx={{
                  mb: 4,
                  typography: 'headline',
                  color: tx?.isError ? '$error' : '$text',
                }}>
                {tx?.pending && texts.transactions.pending}
                {tx?.isSuccess && texts.transactions.success}
                {tx?.isError && texts.transactions.error}
                {tx?.isReplaced && texts.transactions.replaced}
              </Box>
              <Box>
                {tx?.pending && texts.transactions.pendingDescription}
                {tx?.isSuccess && !!successElement
                  ? successElement
                  : tx?.isSuccess && texts.transactions.executed}
                {tx?.isError && texts.transactions.notExecuted}
                {tx?.isReplaced && texts.transactions.txReplaced}
              </Box>
            </Box>

            <Box
              sx={{
                mb: isFinalStatus ? 24 : 0,
                mt: isFinalStatus ? 0 : 24,
                minHeight: 15,
                [theme.breakpoints.up('lg')]: {
                  mb: isFinalStatus ? 40 : 0,
                  mt: isFinalStatus ? 0 : 40,
                },
              }}>
              {tx?.isError && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
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
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Link
                      href={selectTxExplorerLink(
                        transactionsPool,
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
                      mt: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {tx.chainId && (
                      <Link
                        href={selectTxExplorerLink(
                          transactionsPool,
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
                minHeight: 40,
                [theme.breakpoints.up('sm')]: {
                  minHeight: 50,
                },
                [theme.breakpoints.up('lg')]: {
                  minHeight: 55,
                },
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
