import { Box, useTheme } from '@mui/system';
import React from 'react';

import { texts } from '../../helpers/texts/texts';
import { BoxWith3D } from '../BoxWith3D';

export function HelpModalHomeButton() {
  const theme = useTheme();

  return (
    <BoxWith3D
      borderSize={6}
      alwaysWithBorders
      withActions
      leftBorderColor="$secondary"
      bottomBorderColor="$headerGray"
      wrapperCss={{ cursor: 'pointer' }}
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 108,
        height: 30,
      }}>
      <Box
        sx={{
          width: 13,
          height: 21,
          background:
            theme.palette.mode === 'dark'
              ? `url('/helpModals/mainButtonGhostDark.svg')`
              : `url('/helpModals/mainButtonGhost.svg')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mr: 6,
        }}
      />
      <Box
        sx={{
          fontSize: '13px',
          lineHeight: '13px',
          color: '$textWhite',
          fontWeight: 400,
        }}>
        {texts.faq.other.mainMenu}
      </Box>
    </BoxWith3D>
  );
}
