import { Box, useTheme } from '@mui/system';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import { Input } from './primitives/Input';

interface InputWithAnimationProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  animatedPlaceholder?: string;
}

export function InputWithAnimation({
  animatedPlaceholder,
  ...rest
}: InputWithAnimationProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        transition: 'all 0.3s ease',
        '&:focus-within': {
          backgroundColor: theme.palette.$light,
          '.InputWithAnimation__placeholder': {
            left: 6,
            transform: 'translateX(0)',
            color: theme.palette.$text,
            [theme.breakpoints.up('lg')]: {
              left: 11,
            },
          },
        },
        hover: {
          backgroundColor: theme.palette.$light,
          '.InputWithAnimation__placeholder': {
            color: theme.palette.$text,
          },
        },
      }}>
      {!!animatedPlaceholder && !rest.value && (
        <Box
          className="InputWithAnimation__placeholder"
          sx={{
            color: theme.palette.$textDisabled,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            transition: 'all 0.3s ease',
            fontWeight: 600,
            fontSize: 11,
            lineHeight: '14px',
            [theme.breakpoints.up('xsm')]: {
              fontSize: 12,
              lineHeight: '15px',
            },
            [theme.breakpoints.up('lg')]: {
              fontSize: 13,
              lineHeight: '16px',
            },
          }}>
          {animatedPlaceholder}
        </Box>
      )}
      <Input sx={{ backgroundColor: 'transparent !important' }} {...rest} />
    </Box>
  );
}
