import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

import { Container } from '../index';

interface TopPanelContainerProps {
  children: ReactNode;
}

export function TopPanelContainer({ children }: TopPanelContainerProps) {
  return (
    <Container>
      <Box
        sx={(theme) => ({
          mb: 18,
          [theme.breakpoints.up('sm')]: {
            mb: 24,
          },
        })}>
        {children}
      </Box>
    </Container>
  );
}
