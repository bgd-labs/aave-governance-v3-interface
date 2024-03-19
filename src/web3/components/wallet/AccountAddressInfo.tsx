import { Box, useTheme } from '@mui/system';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';

import { Divider, Image } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { getScanLink } from '../../../utils/getScanLink';

interface AccountAddressInfoProps {
  activeAddress: string;
  chainId: number;
  ensNameAbbreviated?: string;
  ensAvatar?: string;
  isAvatarExists?: boolean;
  forTest?: boolean;
}

export function AccountAddressInfo({
  isAvatarExists,
  forTest,
  activeAddress,
  ensAvatar,
  ensNameAbbreviated,
  chainId,
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
      </Box>

      <Divider
        sx={{ my: 14, borderBottomColor: theme.palette.$secondaryBorder }}
      />
    </>
  );
}
