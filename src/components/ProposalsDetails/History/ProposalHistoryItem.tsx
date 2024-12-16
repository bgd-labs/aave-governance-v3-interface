import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import {
  DetailedProposalData,
  HistoryItemType,
  ProposalHistoryItem as IProposalHistoryItem,
} from '../../../types';
import { FormattedNumber } from '../../FormattedNumber';
import { NetworkIcon } from '../../NetworkIcon';
import { ProposalHistoryItemTxLink } from './ProposalHistoryItemTxLink';

export interface ProposalHistoryItemProps {
  proposal: DetailedProposalData;
  item: IProposalHistoryItem;
  onClick?: () => void;
}

export function ProposalHistoryItem({
  proposal,
  onClick,
  item,
}: ProposalHistoryItemProps) {
  const theme = useTheme();

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
          position: 'relative',
          display: 'flex',
          mb: 32,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: 'column',
          flex: 1,
          bottom: 2,
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
          },
          [theme.breakpoints.up('lg')]: {
            bottom: 3.5,
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
              proposal={proposal}
              onClick={onClick}
              item={item}
            />
          )}
        </Box>

        <Box
          component="div"
          sx={{ typography: 'body', width: item.timestamp ? '68%' : '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NetworkIcon
              chainId={item.txInfo.chainId}
              withTooltip
              css={{ mr: 6 }}
            />
            <Box sx={{ display: 'inline-block' }}>
              <Box
                sx={{ b: { fontWeight: 600 } }}
                component="p"
                dangerouslySetInnerHTML={{
                  __html: item.title,
                }}
              />
              {item.type === HistoryItemType.VOTING_OVER &&
                proposal.formattedData.isVotingFailed && (
                  <Box sx={{ mt: 5 }}>
                    Votes: For (
                    <FormattedNumber
                      variant="headline"
                      value={proposal.formattedData.forVotes}
                      visibleDecimals={2}
                    />
                    ) | Against (
                    <FormattedNumber
                      variant="headline"
                      value={proposal.formattedData.againstVotes}
                      visibleDecimals={2}
                    />
                    )
                  </Box>
                )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
