import { Box } from '@mui/system';
import { ReactNode } from 'react';

import { BasicModal, Divider } from '../../ui';
import { texts } from '../../ui/utils/texts';

interface DetailsModalWrapperProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  proposalId: number;
  children: ReactNode;
}

export function DetailsModalWrapper({
  proposalId,
  isOpen,
  setIsOpen,
  children,
}: DetailsModalWrapperProps) {
  return (
    <BasicModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      maxWidth={710}
      withCloseButton>
      <Box sx={(theme) => ({ [theme.breakpoints.up('sm')]: { pt: 20 } })}>
        <Box component="h2" sx={{ typography: 'h1' }}>
          {texts.proposals.detailsModalTitle(proposalId)}
        </Box>

        <Divider
          sx={(theme) => ({
            mt: 18,
            mb: 24,
            [theme.breakpoints.up('lg')]: { mt: 24, mb: 30 },
          })}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>{children}</Box>
      </Box>
    </BasicModal>
  );
}
