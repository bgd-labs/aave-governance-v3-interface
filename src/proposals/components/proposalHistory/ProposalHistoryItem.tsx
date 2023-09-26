import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import { Link } from '../../../ui';
import { NetworkIcon } from '../../../ui/components/NetworkIcon';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';
import { ProposalHistoryItem as IProposalHistoryItem } from '../../store/proposalsHistorySlice';
import { ProposalHistoryItemTxLink } from './ProposalHistoryItemTxLink';

export interface ProposalHistoryItemProps {
  proposalId: number;
  item: IProposalHistoryItem;
  onClick?: () => void;
}

export function ProposalHistoryItem({
  proposalId,
  onClick,
  item,
}: ProposalHistoryItemProps) {
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
        sx={(theme) => ({
          display: 'flex',
          mb: 35,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: 'column',
          flex: 1,
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
          },
        })}>
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
            <Box component="p">{item.title}</Box>
          </Box>

          {!!item.addresses?.length && (
            <>
              <Box component="p" sx={{ typography: 'descriptorAccent', mt: 4 }}>
                {item.addresses.length > 1 ? 'Actions' : 'Action'}
              </Box>
              <Box
                component="ul"
                sx={{
                  typography: 'descriptor',
                  listStyleType: 'disc',
                  pl: 15,
                }}>
                {item.addresses.map((address, index) => (
                  <Link
                    key={index}
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
                  </Link>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
