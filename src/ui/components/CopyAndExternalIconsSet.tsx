import { Box, SxProps, useTheme } from '@mui/system';
import React from 'react';

import CopyIcon from '/public/images/icons/copy.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';

import { IconBox } from '../primitives/IconBox';
import { CopyToClipboard } from './CopyToClipboard';
import { Link } from './Link';

interface CopyAndExternalIconsSetProps {
  iconSize: number;
  copyText?: string;
  externalLink?: string;
  sx?: SxProps;
}

export function CopyAndExternalIconsSet({
  iconSize,
  copyText,
  externalLink,
  sx,
}: CopyAndExternalIconsSetProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        ...sx,
      }}>
      {!!copyText && (
        <Box className="CopyAndExternalIconsSet__copy">
          <CopyToClipboard copyText={copyText}>
            <IconBox
              sx={{
                cursor: 'pointer',
                width: iconSize - 2,
                height: iconSize - 2,
                '> svg': {
                  width: iconSize - 2,
                  height: iconSize - 2,
                },
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
      )}

      {!!externalLink && (
        <Box className="CopyAndExternalIconsSet__link">
          <Link
            href={externalLink}
            css={{
              color: '$textSecondary',
              lineHeight: 1,
              hover: { color: theme.palette.$text },
            }}
            inNewWindow>
            <IconBox
              sx={{
                cursor: 'pointer',
                width: iconSize,
                height: iconSize,
                '> svg': {
                  width: iconSize,
                  height: iconSize,
                },
                path: {
                  transition: 'all 0.2s ease',
                  stroke: theme.palette.$textSecondary,
                },
                hover: { path: { stroke: theme.palette.$main } },
              }}>
              <LinkIcon />
            </IconBox>
          </Link>
        </Box>
      )}
    </Box>
  );
}
