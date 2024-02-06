import { Box, useTheme } from '@mui/system';
import React from 'react';
import { zeroHash } from 'viem';

import LinkIcon from '/public/images/icons/linkIcon.svg';

import { Link, Spinner } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { IconBox } from '../../../ui/primitives/IconBox';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { getScanLink } from '../../../utils/getScanLink';
import { ProposalHistoryItemProps } from './ProposalHistoryItem';

export function ProposalHistoryItemTxLink({
  item,
  onClick,
}: ProposalHistoryItemProps & {
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        mb: 8,
        [theme.breakpoints.up('sm')]: { mt: 4, mb: 0 },
      }}>
      {item.txInfo.hash === zeroHash ? (
        <Box
          component="button"
          type="button"
          sx={{
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s ease',
            color: '$textSecondary',
            hover: { opacity: 0.7 },
          }}
          onClick={onClick}>
          <IconBox
            sx={{
              width: 10,
              height: 10,
              mr: 4,
              '> svg': {
                width: 10,
                height: 10,
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
          <Box component="p" sx={{ typography: 'descriptor', mr: 3 }}>
            {texts.other.explorer}
          </Box>
          <Box sx={{ backgroundColor: '$paper' }}>
            {item.txInfo.hashLoading && (
              <Spinner
                size={10}
                loaderLineColor="$paper"
                loaderCss={{ backgroundColor: '$main' }}
              />
            )}
          </Box>
        </Box>
      ) : (
        <>
          <Link
            href={getScanLink({
              chainId: item.txInfo.chainId,
              address: item.txInfo.hash,
              type: 'tx',
            })}
            css={{
              color: '$textSecondary',
              hover: { color: theme.palette.$text },
            }}
            inNewWindow>
            <Box component="p" sx={{ typography: 'descriptor' }}>
              {textCenterEllipsis(item.txInfo.hash, 5, 5)}
            </Box>
          </Link>

          <CopyAndExternalIconsSet
            iconSize={10}
            sx={{ '.CopyAndExternalIconsSet__copy': { mx: 4 } }}
            externalLink={getScanLink({
              chainId: item.txInfo.chainId,
              address: item.txInfo.hash,
              type: 'tx',
            })}
            copyText={item.txInfo.hash}
          />
        </>
      )}
    </Box>
  );
}
