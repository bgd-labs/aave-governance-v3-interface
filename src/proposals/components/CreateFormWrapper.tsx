import { Box, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import { BoxWith3D } from '../../ui';

interface CreateFormWrapperProps {
  title: string;
  children: ReactNode;
}

export function CreateFormWrapper({ title, children }: CreateFormWrapperProps) {
  const theme = useTheme();

  return (
    <BoxWith3D
      borderSize={10}
      contentColor="$mainLight"
      wrapperCss={{
        width: '100%',
        mb: 25,
        '&:last-of-type': { mb: 0 },
        [theme.breakpoints.up('md')]: { mb: 0, width: '49%' },
      }}
      css={{ p: 12, [theme.breakpoints.up('lg')]: { p: 20 } }}>
      <Box component="h2" sx={{ typography: 'h2', mb: 20 }}>
        {title}
      </Box>
      {children}
    </BoxWith3D>
  );
}
