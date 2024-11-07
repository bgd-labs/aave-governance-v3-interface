import { Box, useTheme } from '@mui/system';
import React from 'react';

import CopyIcon from '../../assets/icons/copy.svg';
import { texts } from '../../helpers/texts/texts';
import { CopyToClipboard } from '../CopyToClipboard';
import { IconBox } from '../primitives/IconBox';

interface CopyErrorButtonProps {
  errorMessage: Error | string;
}

export function CopyErrorButton({ errorMessage }: CopyErrorButtonProps) {
  const theme = useTheme();

  return (
    <CopyToClipboard copyText={errorMessage.toString()}>
      <Box
        sx={{
          typography: 'descriptor',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '$textSecondary',
          mt: 6,
          transition: 'all 0.2s ease',
          hover: {
            color: theme.palette.$text,
            '.CopyErrorButton__icon': {
              path: { stroke: theme.palette.$text },
            },
          },
        }}>
        {texts.other.copyError}
        <IconBox
          className="CopyErrorButton__icon"
          sx={{
            width: 9,
            height: 9,
            '> svg': {
              width: 9,
              height: 9,
            },
            ml: 4,
            path: {
              transition: 'all 0.2s ease',
              stroke: theme.palette.$textSecondary,
            },
          }}>
          <CopyIcon />
        </IconBox>
      </Box>
    </CopyToClipboard>
  );
}
