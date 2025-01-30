'use client';

import { styled } from '@mui/system';

export const Input = styled('input')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  lineHeight: '1',
  fontWeight: '400',
  transition: 'all 0.2s ease',

  fontSize: 11,
  padding: '7px 23px 7px 5px',
  border: `1px solid ${theme.palette.$main}`,
  color: theme.palette.$text,
  backgroundColor: theme.palette.$mainLight,
  [theme.breakpoints.up('xsm')]: {
    padding: '7px 23px 7px 5px',
    fontSize: 12,
  },
  [theme.breakpoints.up('lg')]: {
    padding: '8px 25px 8px 10px',
    fontSize: 13,
  },
  '&:active, &:focus': {
    backgroundColor: theme.palette.$light,
  },
  '&::placeholder': {
    color: theme.palette.$textDisabled,
  },
  '&:hover': {
    backgroundColor: theme.palette.$light,
  },
}));
