import { Box, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import { BoxWith3D } from '../BoxWith3D';

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
        mb: 18,
        '&:last-of-type': { mb: 0 },
        [theme.breakpoints.up('md')]: { mb: 0, width: 'calc(50% - 12px)' },
      }}
      css={{ p: 18, [theme.breakpoints.up('lg')]: { p: 24 } }}>
      <Box component="h2" sx={{ typography: 'h2', mb: 24 }}>
        {title}
      </Box>
      {children}
    </BoxWith3D>
  );
}
