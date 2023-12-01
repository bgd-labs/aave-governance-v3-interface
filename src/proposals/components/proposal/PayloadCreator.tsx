import { Box, SxProps } from '@mui/system';
import React from 'react';

import { NewPayload } from '../../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { Link } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';

interface PayloadCreatorProps {
  payload: NewPayload;
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
              hover: {
                opacity: 0.7,
              },
            }}
            inNewWindow
            href={`${chainInfoHelper.getChainParameters(
              payload.chainId || appConfig.govCoreChainId,
            ).blockExplorers?.default.url}/address/${payload.creator}`}>
            {textCenterEllipsis(payload.creator, ellipsisFrom || 8, 8)}
          </Link>

          <CopyAndExternalIconsSet
            sx={{ '.CopyAndExternalIconsSet__copy': { mx: 4 } }}
            iconSize={iconSize || 10}
            copyText={payload.creator}
            externalLink={`${chainInfoHelper.getChainParameters(
              payload.chainId || appConfig.govCoreChainId,
            ).blockExplorers?.default.url}/address/${payload.creator}`}
          />
        </Box>
      </Box>
    </Box>
  );
}
