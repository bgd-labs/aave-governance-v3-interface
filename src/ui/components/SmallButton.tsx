import { Box, useTheme } from '@mui/system';
import React, { MouseEventHandler, ReactNode } from 'react';

import { Spinner } from './Spinner';

export interface SmallButtonProps {
  type?: 'button' | 'submit';
  children: string | ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function SmallButton({
  type,
  children,
  disabled,
  loading,
  onClick,
}: SmallButtonProps) {
  const theme = useTheme();

  return (
    <Box
      component="button"
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        transition: 'all 0.2s ease',
        border: `1px solid ${theme.palette.$main}`,
        minWidth: 95,
        height: 20,
        position: 'relative',
        hover: {
          '.SmallButton__inner': {
            borderTop: `1px solid ${theme.palette.$mainBorder}`,
            borderRight: `1px solid ${theme.palette.$mainBorder}`,
            width: 'calc(100% - 2px)',
            height: 'calc(100% - 2px)',
          },
          '.SmallButton__rotateLine': {
            backgroundColor: `${theme.palette.$mainBorder} !important`,
          },
        },
        '&:active': {
          '.SmallButton__inner': {
            borderTop: `1px solid ${theme.palette.$mainBorder}`,
            borderRight: `1px solid ${theme.palette.$mainBorder}`,
            width: 'calc(100% - 4px)',
            height: 'calc(100% - 4px)',
          },
          '.SmallButton__rotateLine': {
            backgroundColor: '$mainBorder',
          },
        },
        '&:disabled': {
          cursor: 'not-allowed',
          '.SmallButton__inner': {
            cursor: 'not-allowed',
            borderTop: `1px solid transparent`,
            borderRight: `1px solid transparent`,
            backgroundColor: '$disabled',
            width: '100%',
            height: '100%',
          },
        },
        [theme.breakpoints.up('lg')]: {
          minWidth: 102,
          height: 22,
        },
      }}>
      <Box
        sx={{
          width: '100%',
          height: 4,
          transition: 'all 0.2s ease',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '$buttonBorderLeft',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          height: '100%',
          width: 4,
          transition: 'all 0.2s ease',
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: '$buttonBorderBottom',
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 3,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: '4px 4px 0 0',
          borderColor: `${theme.palette.$buttonBorderLeft} transparent transparent transparent`,
        }}
      />
      <Box
        className="SmallButton__rotateLine"
        sx={{
          transition: 'all 0.2s ease',
          position: 'absolute',
          right: '-2px',
          top: 2,
          backgroundColor: '$main',
          width: '8px',
          height: '1px',
          transform: 'rotate(-45deg)',
          zIndex: 4,
        }}
      />
      <Box
        className="SmallButton__inner"
        sx={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          zIndex: 5,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: `1px solid transparent`,
          borderRight: `1px solid transparent`,
          transition: 'all 0.2s ease',
          backgroundColor: '$mainLight',
          color: '$text',
          p: '0px 4px 1px 5px',
        }}>
        <Box
          sx={{
            fontWeight: '400',
            letterSpacing: '0.03em',
            fontSize: 11,
            lineHeight: '13px',
          }}>
          {children}
        </Box>
        {loading && (
          <Box
            sx={{
              backgroundColor: '$disabled',
              ml: 5,
              position: 'relative',
              top: 0.5,
            }}>
            <Spinner
              size={12}
              loaderLineColor="$paper"
              loaderCss={{
                background: theme.palette.$text,
              }}
              lineSize={2}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
