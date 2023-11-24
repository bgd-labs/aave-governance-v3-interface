import { Box } from '@mui/system';
import { ReactNode } from 'react';

import { useStore } from '../../store';
import { BasicModal } from '../components/BasicModal';

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
  const { isHelpModalOpen, setIsHelpModalOpen } = useStore();

  return (
    <BasicModal
      isOpen={typeof isOpen !== 'undefined' ? isOpen : isHelpModalOpen}
      setIsOpen={
        typeof setIsOpen !== 'undefined' ? setIsOpen : setIsHelpModalOpen
      }
      maxWidth={500}
      onBackButtonClick={onBackButtonClick}
      contentCss={{
        p: '55px 10px !important',
      }}
      withCloseButton>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box sx={{ mb: 20, width: 234, height: 216 }}>{image}</Box>
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
