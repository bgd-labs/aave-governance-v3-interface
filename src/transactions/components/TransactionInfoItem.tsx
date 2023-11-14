import {
  selectTxExplorerLink,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import ArrowRightIcon from '/public/images/icons/arrowRight.svg';
import CheckIcon from '/public/images/icons/check.svg';
import CopyIcon from '/public/images/icons/copy.svg';
import CrossIcon from '/public/images/icons/cross.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';
import ReplacedIcon from '/public/images/icons/replacedIcon.svg';

import { DelegatedText } from '../../delegate/components/DelegatedText';
import { TxText } from '../../representations/components/TxText';
import { useStore } from '../../store';
import { CopyToClipboard, Link, Spinner } from '../../ui';
import { ChainNameWithIcon } from '../../ui/components/ChainNameWithIcon';
import { IconBox } from '../../ui/primitives/IconBox';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';
import { getTokenName } from '../../utils/getTokenName';
import { TxWithStatus } from '../store/transactionsSlice';

interface TransactionInfoItemProps {
  tx: TxWithStatus;
}

export function TransactionInfoItem({ tx }: TransactionInfoItemProps) {
  const theme = useTheme();
  const state = useStore();

  const NetworkIconWitchChainN = () => {
    return (
      <ChainNameWithIcon
        chainId={tx.chainId}
        iconSize={8}
        css={{
          display: 'inline-block',
          '.NetworkIcon': { mr: 2 },
          '.ChainNameWithIcon__text': { display: 'inline' },
        }}
      />
    );
  };

  const NetworkIconWitchGovCoreChainN = () => {
    return (
      <ChainNameWithIcon
        chainId={appConfig.govCoreChainId}
        iconSize={8}
        css={{
          display: 'inline-block',
          '.NetworkIcon': { mr: 2 },
          '.ChainNameWithIcon__text': { display: 'inline' },
        }}
      />
    );
  };

  return (
    <Box sx={{ mb: 14, width: '100%', '&:last-of-type': { mb: 0 } }}>
      <Box sx={{ textAlign: 'left' }}>
        {tx.localTimestamp && (
          <Box component="span" sx={{ typography: 'headline' }}>
            {tx.type === 'test'
              ? dayjs.unix(tx.localTimestamp).format('MMM D, h:mm A')
              : dayjs(tx.localTimestamp).format('MMM D, h:mm A')}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        <Box
          sx={{
            flex: 1,
            display: 'inline-block',
          }}>
          {tx.type === 'test' && <>{texts.transactions.testTransaction}</>}
          {tx.type === 'createPayload' && tx.payload && (
            <>
              {texts.transactions.createPayloadTx}{' '}
              <b>#{tx.payload.payloadId}</b> on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'createProposal' && tx.payload && (
            <>
              {texts.transactions.createProposalTx}{' '}
              <b>#{tx.payload.proposalId}</b> on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'activateVoting' && tx.payload && (
            <>
              {texts.transactions.activateVotingTx}{' '}
              <b>#{tx.payload.proposalId}</b> on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'sendProofs' && tx.payload && (
            <>
              {texts.transactions.sendProofsTx}{' '}
              <b>{getTokenName(tx.payload.underlyingAsset)}</b> for the proposal{' '}
              <b>#{tx.payload.proposalId}</b>, on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'activateVotingOnVotingMachine' && tx.payload && (
            <>
              {texts.transactions.activateVotingOnVotingMachineTx}{' '}
              <b>#{tx.payload.proposalId}</b>, on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'vote' && tx.payload && (
            <>
              {texts.transactions.voteTx}{' '}
              <b>{tx.payload.support ? 'for' : 'against'}</b>{' '}
              {tx.payload.voter !== state.activeWallet?.address && (
                <>
                  {texts.transactions.voteTxAsRepresentative}{' '}
                  <Link
                    css={{
                      color: '$textSecondary',
                      fontWeight: 500,
                      hover: { opacity: 0.7 },
                    }}
                    href={`${chainInfoHelper.getChainParameters(tx.chainId)
                      .blockExplorers?.default.url}/address/${
                      tx.payload.voter
                    }`}
                    inNewWindow>
                    {textCenterEllipsis(tx.payload.voter, 6, 4)}
                  </Link>
                </>
              )}{' '}
              for the proposal <b>#{tx.payload.proposalId}</b> on{' '}
              <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'closeAndSendVote' && tx.payload && (
            <>
              {texts.transactions.closeVoteTx} <b>#{tx.payload.proposalId}</b>{' '}
              on <NetworkIconWitchChainN />{' '}
              {texts.transactions.sendVoteResultsTx}{' '}
              <NetworkIconWitchGovCoreChainN />
            </>
          )}
          {tx.type === 'executeProposal' && tx.payload && (
            <>
              {texts.transactions.executeProposalTx}{' '}
              <b>#{tx.payload.proposalId}</b> on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'executePayload' && tx.payload && (
            <>
              {texts.transactions.executePayloadTx}{' '}
              <b>#{tx.payload.payloadId}</b> on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'delegate' && tx.payload && (
            <>
              <DelegatedText
                delegateData={tx.payload.delegateData}
                formDelegateData={tx.payload.formDelegateData}
              />{' '}
              on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'cancelProposal' && tx.payload && (
            <>
              {texts.transactions.cancelProposalTx}{' '}
              <b>#{tx.payload.proposalId}</b> on <NetworkIconWitchChainN />
            </>
          )}
          {tx.type === 'representations' && tx.payload && (
            <>
              <TxText
                initialData={tx.payload.initialData}
                formData={tx.payload.data}
                inTxHistory
              />{' '}
              on <NetworkIconWitchChainN />
            </>
          )}
        </Box>

        <Box
          sx={{
            width: 30,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <Box sx={{ lineHeight: 0, backgroundColor: '$paper' }}>
            {tx.pending && (
              <Spinner
                size={16}
                loaderLineColor="$paper"
                loaderCss={{ backgroundColor: '$main' }}
              />
            )}
            {tx.status && (
              <IconBox
                sx={{
                  width: 16,
                  height: 16,
                  '> svg': {
                    width: 16,
                    height: 16,
                  },
                  ellipse: {
                    fill:
                      tx.status === TransactionStatus.Replaced
                        ? theme.palette.$textSecondary
                        : undefined,
                  },
                  path: {
                    stroke:
                      tx.status === TransactionStatus.Success
                        ? theme.palette.$mainFor
                        : tx.status === TransactionStatus.Replaced
                          ? undefined
                          : theme.palette.$mainAgainst,
                    fill:
                      tx.status === TransactionStatus.Replaced
                        ? theme.palette.$textSecondary
                        : undefined,
                    '&:last-of-type': {
                      stroke:
                        tx.status === TransactionStatus.Success
                          ? theme.palette.$mainFor
                          : tx.status === TransactionStatus.Replaced
                            ? theme.palette.$textSecondary
                            : theme.palette.$mainAgainst,
                    },
                  },
                }}>
                {tx.status === TransactionStatus.Success ? (
                  <CheckIcon />
                ) : tx.status === TransactionStatus.Replaced ? (
                  <ReplacedIcon />
                ) : (
                  <CrossIcon />
                )}
              </IconBox>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
        {tx.hash && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              a: { lineHeight: 0 },
            }}>
            <Link
              href={selectTxExplorerLink(
                state,
                chainInfoHelper.getChainParameters,
                tx.hash,
                state.activeWallet?.isContractAddress,
              )}
              css={{
                display: 'inline-flex',
                color: tx.replacedTxHash ? '$textDisabled' : '$textSecondary',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                hover: {
                  color: tx.replacedTxHash
                    ? theme.palette.$textDisabled
                    : theme.palette.$text,
                  svg: {
                    path: {
                      '&:first-of-type': {
                        stroke: tx.replacedTxHash
                          ? theme.palette.$textDisabled
                          : theme.palette.$text,
                      },
                      '&:last-of-type': {
                        fill: tx.replacedTxHash
                          ? theme.palette.$textDisabled
                          : theme.palette.$text,
                      },
                    },
                  },
                },
              }}
              inNewWindow>
              <Box component="p" sx={{ typography: 'descriptor' }}>
                {textCenterEllipsis(tx.hash, 5, 5)}
              </Box>
              <IconBox
                sx={{
                  width: 10,
                  height: 10,
                  ml: 2,
                  '> svg': {
                    width: 10,
                    height: 10,
                    transition: 'all 0.2s ease',
                    path: {
                      '&:first-of-type': {
                        stroke: tx.replacedTxHash
                          ? theme.palette.$textDisabled
                          : theme.palette.$textSecondary,
                      },
                      '&:last-of-type': {
                        fill: tx.replacedTxHash
                          ? theme.palette.$textDisabled
                          : theme.palette.$textSecondary,
                      },
                    },
                  },
                }}>
                <LinkIcon />
              </IconBox>
            </Link>

            <CopyToClipboard copyText={tx.hash}>
              <IconBox
                sx={{
                  cursor: 'pointer',
                  width: 10,
                  height: 10,
                  '> svg': {
                    width: 10,
                    height: 10,
                  },
                  ml: 3,
                  path: {
                    transition: 'all 0.2s ease',
                    stroke: tx.replacedTxHash
                      ? theme.palette.$textDisabled
                      : theme.palette.$textSecondary,
                  },
                  hover: {
                    path: {
                      stroke: tx.replacedTxHash
                        ? theme.palette.$textDisabled
                        : theme.palette.$main,
                    },
                  },
                }}>
                <CopyIcon />
              </IconBox>
            </CopyToClipboard>
          </Box>
        )}

        {tx.replacedTxHash && (
          <Box sx={{ mx: 6 }}>
            <IconBox
              sx={{
                width: 12,
                height: 12,
                '> svg': {
                  width: 12,
                  height: 12,
                },
                path: {
                  transition: 'all 0.2s ease',
                  stroke: theme.palette.$text,
                },
              }}>
              <ArrowRightIcon />
            </IconBox>
          </Box>
        )}

        {tx.replacedTxHash && tx.hash && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              a: { lineHeight: 0 },
            }}>
            <Link
              href={selectTxExplorerLink(
                state,
                chainInfoHelper.getChainParameters,
                tx.hash,
                state.activeWallet?.isContractAddress,
                tx.replacedTxHash,
              )}
              css={{
                display: 'inline-flex',
                color: '$textSecondary',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                hover: {
                  color: theme.palette.$text,
                  svg: {
                    path: {
                      '&:first-of-type': {
                        stroke: theme.palette.$text,
                      },
                      '&:last-of-type': {
                        fill: theme.palette.$text,
                      },
                    },
                  },
                },
              }}
              inNewWindow>
              <Box component="p" sx={{ typography: 'descriptor' }}>
                {textCenterEllipsis(tx.replacedTxHash, 5, 5)}
              </Box>
              <IconBox
                sx={{
                  width: 10,
                  height: 10,
                  ml: 2,
                  '> svg': {
                    width: 10,
                    height: 10,
                    transition: 'all 0.2s ease',
                    path: {
                      '&:first-of-type': {
                        stroke: theme.palette.$textSecondary,
                      },
                      '&:last-of-type': {
                        fill: theme.palette.$textSecondary,
                      },
                    },
                  },
                }}>
                <LinkIcon />
              </IconBox>
            </Link>

            <CopyToClipboard copyText={tx.replacedTxHash}>
              <IconBox
                sx={{
                  cursor: 'pointer',
                  width: 10,
                  height: 10,
                  '> svg': {
                    width: 10,
                    height: 10,
                  },
                  ml: 3,
                  path: {
                    transition: 'all 0.2s ease',
                    stroke: theme.palette.$textSecondary,
                  },
                  hover: { path: { stroke: theme.palette.$main } },
                }}>
                <CopyIcon />
              </IconBox>
            </CopyToClipboard>
          </Box>
        )}
      </Box>
    </Box>
  );
}
