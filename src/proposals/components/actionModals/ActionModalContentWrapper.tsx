import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

interface ActionModalWrapperProps {
  children: ReactNode;
}

export function ActionModalTitle({ title }: { title: string }) {
  return (
    <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
      <Box component="h2" sx={{ typography: 'h2' }}>
        {title}
      </Box>
    </Box>
  );
}

export function ActionModalContentWrapper({
  children,
}: ActionModalWrapperProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        flexDirection: 'column',
        zIndex: 2,
        py: 20,
      }}>
      {children}
    </Box>
  );
}
