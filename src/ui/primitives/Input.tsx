import { styled } from '@mui/system';

export const Input = styled('input')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  fontWeight: '400',
  fontSize: 11,
  lineHeight: '14px',
  padding: '7px 23px 7px 5px',
  border: `1px solid ${theme.palette.$disabled}`,
  color: theme.palette.$text,
  transition: 'all 0.2s ease',
  backgroundColor: theme.palette.$mainLight,
  [theme.breakpoints.up('xsm')]: {
    padding: '7px 23px 7px 5px',
    fontSize: 12,
    lineHeight: '15px',
  },
  [theme.breakpoints.up('lg')]: {
    padding: '8px 25px 8px 10px',
    fontSize: 13,
    lineHeight: '16px',
  },
  '&:active, &:focus': {
    borderColor: theme.palette.$main,
  },
  '&:hover': {
    borderColor: theme.palette.$main,
  },
  '&::placeholder': {
    color: theme.palette.$textDisabled,
  },
}));
