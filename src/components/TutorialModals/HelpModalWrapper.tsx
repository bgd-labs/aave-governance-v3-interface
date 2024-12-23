import { Box } from '@mui/system';
import { ReactNode } from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { BasicModal } from '../BasicModal';

interface HelpModalWrapperProps {
  image: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  onBackButtonClick?: () => void;
}

export function HelpModalWrapper({
  image,
  children,
  isOpen,
  setIsOpen,
  onBackButtonClick,
}: HelpModalWrapperProps) {
  const isHelpModalOpen = useStore((store) => store.isHelpModalOpen);
  const setIsHelpModalOpen = useStore((store) => store.setIsHelpModalOpen);

  return (
    <BasicModal
      isOpen={typeof isOpen !== 'undefined' ? isOpen : isHelpModalOpen}
      setIsOpen={
        typeof setIsOpen !== 'undefined' ? setIsOpen : setIsHelpModalOpen
      }
      maxWidth={500}
      onBackButtonClick={onBackButtonClick}
      withCloseButton>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box sx={{ mb: 24, width: 234, height: 216 }}>{image}</Box>
        <Box
          sx={{
            width: '80%',
            textAlign: 'center',
          }}>
          {children}
        </Box>
      </Box>
    </BasicModal>
  );
}
