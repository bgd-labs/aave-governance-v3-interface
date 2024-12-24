import { Box, SxProps } from '@mui/system';
import React from 'react';
import { Address } from 'viem';

import { getScanLink } from '../helpers/getScanLink';
import { texts } from '../helpers/texts/texts';
import { textCenterEllipsis } from '../styles/textCenterEllipsis';
import { PayloadWithHashes } from '../types';
import { CopyAndExternalIconsSet } from './CopyAndExternalIconsSet';
import { Link } from './Link';

interface PayloadCreatorProps {
  payload: PayloadWithHashes;
  mb?: number;
  ellipsisFrom?: number;
  mainTypography?: string;
  addressTypography?: string;
  iconSize?: number;
  sx?: SxProps;
}

export function PayloadCreator({
  payload,
  mb,
  ellipsisFrom,
  mainTypography,
  addressTypography,
  iconSize,
  sx,
}: PayloadCreatorProps) {
  return (
    <Box sx={{ mb: mb || 4 }}>
      <Box
        sx={{
          typography: mainTypography || 'descriptorAccent',
          wordBreak: 'break-word',
          ...sx,
        }}>
        {texts.proposals.payloadsDetails.creator}:{' '}
        <Box
          sx={{
            display: 'inline-flex',
            typography: addressTypography || 'descriptor',
          }}>
          <Link
            css={{
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'none',
              hover: {
                opacity: 0.7,
              },
            }}
            inNewWindow
            href={getScanLink({
              chainId: Number(payload.chain),
              address: payload.data.creator as Address,
            })}>
            {textCenterEllipsis(
              payload.data.creator as Address,
              ellipsisFrom || 8,
              8,
            )}
          </Link>

          <CopyAndExternalIconsSet
            sx={{ '.CopyAndExternalIconsSet__copy': { mx: 4 } }}
            iconSize={iconSize || 10}
            copyText={payload.data.creator}
            externalLink={getScanLink({
              chainId: Number(payload.chain),
              address: payload.data.creator as Address,
            })}
          />
        </Box>
      </Box>
    </Box>
  );
}
