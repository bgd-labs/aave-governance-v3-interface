import { Box, useTheme } from '@mui/system';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';

import { getScanLink } from '../../../helpers/getScanLink';
import { texts } from '../../../helpers/texts/texts';
import { CopyAndExternalIconsSet } from '../../CopyAndExternalIconsSet';
import { Divider } from '../../primitives/Divider';
import { Image } from '../../primitives/Image';

interface AccountAddressInfoProps {
  activeAddress: string;
  chainId: number;
  ensNameAbbreviated?: string;
  ensAvatar?: string;
  isAvatarExists?: boolean;
  forTest?: boolean;
  onDisconnectButtonClick: () => void;
}

export function AccountAddressInfo({
  isAvatarExists,
  forTest,
  activeAddress,
  ensAvatar,
  ensNameAbbreviated,
  chainId,
  onDisconnectButtonClick,
}: AccountAddressInfoProps) {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={
              !isAvatarExists || forTest
                ? makeBlockie(activeAddress !== '' ? activeAddress : 'default')
                : ensAvatar
            }
            alt=""
            sx={{ width: 34, height: 34, borderRadius: '50%' }}
          />

          <Box sx={{ display: 'flex', ml: 10, alignItems: 'center' }}>
            <Box component="h2" sx={{ typography: 'h1' }}>
              {ensNameAbbreviated}
            </Box>

            <CopyAndExternalIconsSet
              iconSize={16}
              copyText={activeAddress}
              externalLink={getScanLink({ chainId, address: activeAddress })}
              sx={{ '.CopyAndExternalIconsSet__copy': { mx: 8 } }}
            />
          </Box>
        </Box>

        <Box
          onClick={onDisconnectButtonClick}
          sx={{
            color: '$textSecondary',
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'all 0.2s ease',
            hover: { color: theme.palette.$text },
          }}>
          <Box component="p">{texts.walletConnect.disconnect}</Box>
        </Box>
      </Box>

      <Divider
        sx={{ my: 14, borderBottomColor: theme.palette.$secondaryBorder }}
      />
    </>
  );
}
