import { styled } from '@mui/system';

export const Container = styled('div')(({ theme }) => ({
  margin: '0 auto',
  position: 'relative',
  zIndex: 2,
  paddingLeft: 12,
  paddingRight: 12,
  maxWidth: 980,
  [theme.breakpoints.up('sm')]: { paddingLeft: 20, paddingRight: 20 },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 1180,
  },
}));
