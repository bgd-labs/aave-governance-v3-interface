import { styled } from '@mui/system';

export const Divider = styled('div')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.$disabled}`,
}));
