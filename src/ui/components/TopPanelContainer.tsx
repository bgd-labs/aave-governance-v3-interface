import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

import { Container } from '../index';

interface TopPanelContainerProps {
  children: ReactNode;
  withoutContainer?: boolean;
}

export function TopPanelContainer({
  children,
  withoutContainer,
}: TopPanelContainerProps) {
  const Children = () => {
    return (
      <Box
        sx={(theme) => ({
          mb: 18,
          [theme.breakpoints.up('sm')]: {
            mb: 24,
          },
        })}>
        {children}
      </Box>
    );
  };

  return (
    <>
      {!withoutContainer ? (
        <Container>
          <Children />
        </Container>
      ) : (
        <Children />
      )}
    </>
  );
}
