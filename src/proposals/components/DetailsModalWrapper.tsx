import { Box } from '@mui/system';
import { ReactNode } from 'react';

import { BasicModal } from '../../ui';
import { texts } from '../../ui/utils/texts';

interface DetailsModalWrapperProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: ReactNode;
}

export function DetailsModalWrapper({
  isOpen,
  setIsOpen,
  children,
}: DetailsModalWrapperProps) {
  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={830}
      withCloseButton>
      <Box
        sx={(theme) => ({ [theme.breakpoints.up('sm')]: { p: '40px 60px' } })}>
        <Box component="h2" sx={{ typography: 'h1', mb: 40 }}>
          {texts.proposals.detailsModalTitle}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>{children}</Box>
      </Box>
    </BasicModal>
  );
}
