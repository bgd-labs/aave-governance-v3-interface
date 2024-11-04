import { Box } from '@mui/system';
import { ReactNode } from 'react';

interface CreateFieldsArrayTitleProps {
  title: string;
  isTitleVisible: boolean;
  children: ReactNode;
}

export function CreateFieldsArrayTitle({
  title,
  isTitleVisible,
  children,
}: CreateFieldsArrayTitleProps) {
  return (
    <Box sx={{ mb: 20 }}>
      {isTitleVisible && (
        <Box component="h3" sx={{ typography: 'h3', mb: 12, fontWeight: 600 }}>
          {title}
        </Box>
      )}

      {children}
    </Box>
  );
}
