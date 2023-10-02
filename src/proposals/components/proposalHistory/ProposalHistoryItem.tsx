import {
  getProposalStepsAndAmounts,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers/src';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import CopyIcon from '/public/images/icons/copy.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';

import { CopyToClipboard, Link } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { NetworkIcon } from '../../../ui/components/NetworkIcon';
import { IconBox } from '../../../ui/primitives/IconBox';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';
import {
  HistoryItemType,
  ProposalHistoryItem as IProposalHistoryItem,
} from '../../store/proposalsHistorySlice';
import { ProposalHistoryItemTxLink } from './ProposalHistoryItemTxLink';

export interface ProposalHistoryItemProps {
  proposalId: number;
  proposalData: ProposalWithLoadings;
  item: IProposalHistoryItem;
  onClick?: () => void;
}

export function ProposalHistoryItem({
  proposalId,
  proposalData,
  onClick,
  item,
}: ProposalHistoryItemProps) {
  const theme = useTheme();

  const { isVotingFailed, forVotes, againstVotes } = getProposalStepsAndAmounts(
    {
      proposalData: proposalData.proposal.data,
      quorum: proposalData.proposal.config.quorum,
      differential: proposalData.proposal.config.differential,
      precisionDivider: proposalData.proposal.precisionDivider,
      cooldownPeriod: proposalData.proposal.timings.cooldownPeriod,
      executionPayloadTime: proposalData.proposal.timings.executionPayloadTime,
    },
  );

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        '&:last-of-type': {
          '&:after': {
            display: 'none',
          },
        },
        '&:after': {
          content: `''`,
          position: 'absolute',
          top: 10,
          left: 3,
          height: '100%',
          width: 5,
          backgroundColor: '$main',
        },
      }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          backgroundColor: '$mainLight',
          borderColor: '$main',
          borderStyle: 'solid',
          borderWidth: '4px',
          mr: 20,
          position: 'relative',
          top: 2,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          mb: 35,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: 'column',
          flex: 1,
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
          },
        }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {!!item.timestamp && (
            <Box
              component="p"
              sx={(theme) => ({
                typography: 'headline',
                whiteSpace: 'nowrap',
                width: '30%',
                mb: 4,
                [theme.breakpoints.up('sm')]: { mb: 0 },
              })}>
              {dayjs.unix(item.timestamp).format('D MMM YYYY, h:mm A')}
            </Box>
          )}

          {!!item.timestamp && !!onClick && (
            <ProposalHistoryItemTxLink
              proposalData={proposalData}
              proposalId={proposalId}
              onClick={onClick}
              item={item}
            />
          )}
        </Box>

        <Box
          component="div"
          sx={{ typography: 'body', width: item.timestamp ? '68%' : '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NetworkIcon chainId={item.txInfo.chainId} css={{ mr: 8 }} />
            <Box sx={{ display: 'inline-block' }}>
              <Box
                sx={{ b: { fontWeight: 600 } }}
                component="p"
                dangerouslySetInnerHTML={{
                  __html: item.title,
                }}
              />
              {item.type === HistoryItemType.VOTING_OVER && isVotingFailed && (
                <Box sx={{ mt: 5 }}>
                  Votes: For (
                  <FormattedNumber
                    variant="headline"
                    value={forVotes}
                    visibleDecimals={2}
                  />
                  ) | Against (
                  <FormattedNumber
                    variant="headline"
                    value={againstVotes}
                    visibleDecimals={2}
                  />
                  )
                </Box>
              )}
            </Box>
          </Box>

          {!!item.addresses?.length && (
            <>
              <Box component="p" sx={{ typography: 'descriptorAccent', mt: 4 }}>
                {item.addresses.length > 1 ? 'Actions' : 'Action'}
              </Box>
              <Box
                component="ul"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  typography: 'descriptor',
                  listStyleType: 'disc',
                  pl: 15,
                }}>
                {item.addresses.map((address, index) => (
                  <Box
                    sx={{ display: 'inline-flex', alignItems: 'center' }}
                    key={index}>
                    <Link
                      css={{ display: 'inline-flex', alignItems: 'center' }}
                      inNewWindow
                      href={`${
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        chainInfoHelper.getChainParameters(
                          item.txInfo.chainId || appConfig.govCoreChainId,
                        ).blockExplorerUrls[0]
                      }address/${address}`}>
                      <Box
                        component="li"
                        sx={{
                          mt: 2,
                          transition: 'all 0.2s ease',
                          hover: { opacity: 0.7 },
                        }}>
                        {textCenterEllipsis(address, 6, 6)}
                      </Box>

                      <IconBox
                        sx={{
                          width: 10,
                          height: 10,
                          ml: 2,
                          '> svg': {
                            width: 10,
                            height: 10,
                            path: {
                              '&:first-of-type': {
                                stroke: theme.palette.$text,
                              },
                              '&:last-of-type': {
                                fill: theme.palette.$text,
                              },
                            },
                          },
                        }}>
                        <LinkIcon />
                      </IconBox>
                    </Link>

                    <CopyToClipboard copyText={address}>
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
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
