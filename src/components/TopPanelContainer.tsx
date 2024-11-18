import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

import { Container } from './primitives/Container';

interface TopPanelContainerProps {
  children: ReactNode;
  withoutContainer?: boolean;
}

export function TopPanelContainer({
  children,
  withoutContainer,
}: TopPanelContainerProps) {
  return (
    <>
      {!withoutContainer ? (
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
      ) : (
        <Box
          sx={(theme) => ({
            mb: 18,
            [theme.breakpoints.up('sm')]: {
              mb: 24,
            },
          })}>
          {children}
        </Box>
      )}
    </>
  );
}
