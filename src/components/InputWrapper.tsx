import { Box, SxProps, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import CrossIcon from '../assets/icons/cross.svg';
import { IconBox } from './primitives/IconBox';

interface InputWrapperProps {
  children: ReactNode;
  label?: string;
  isError?: boolean;
  error?: string;
  onCrossClick?: () => void;
  css?: SxProps;
}

export function InputWrapper({
  isError,
  error,
  children,
  label,
  onCrossClick,
  css,
}: InputWrapperProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        ...css,
      }}>
      {!!label && (
        <Box component="p" sx={{ typography: 'body', mb: 6 }}>
          {label}
        </Box>
      )}

      {children}

      {!!onCrossClick && (
        <Box
          component="button"
          type="button"
          onClick={onCrossClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            lineHeight: 0,
            transition: 'all 0.2s ease',
            hover: {
              opacity: 0.7,
            },
            top: 0,
            right: 0,
            height: '100%',
            paddingX: 10,
          }}>
          <IconBox
            sx={{
              width: 11,
              height: 11,
              '> svg': {
                width: 11,
                height: 11,
              },
              path: { stroke: theme.palette.$main },
            }}>
            <CrossIcon />
          </IconBox>
        </Box>
      )}

      {isError && (
        <Box
          component="p"
          sx={{
            typography: 'descriptor',
            color: '$textWhite',
            position: 'absolute',
            top: '100%',
            alignSelf: 'flex-start',
            textAlign: 'left',
            width: '100%',
            p: '5px 10px',
            backgroundColor: '$error',
          }}>
          {error}
        </Box>
      )}
    </Box>
  );
}
