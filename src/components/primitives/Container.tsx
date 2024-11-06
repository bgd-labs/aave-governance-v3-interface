import { styled } from '@mui/system';

export const Container = styled('div')(({ theme }) => ({
  margin: '0 auto',
  position: 'relative',
  zIndex: 2,
  paddingLeft: 8,
  paddingRight: 8,
  maxWidth: 988,
  [theme.breakpoints.up('sm')]: {
    paddingLeft: 24,
    paddingRight: 24,
    maxWidth: 1022,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 1228,
  },
}));
