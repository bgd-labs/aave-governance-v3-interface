import { useTheme } from '@mui/system';

import { useStore } from '../../store';
import { BasicModal } from '../';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';

export function HelpRepresentativeModal() {
  const theme = useTheme();

  const {
    isHelpRepresentativeModalOpen,
    setIsHelpRepresentativeModalOpen,
    setIsHelpNavigationModalOpen,
  } = useStore();

  const handleClick = () => {
    setIsHelpRepresentativeModalOpen(false);
    setIsHelpNavigationModalOpen(true);
  };

  return (
    <BasicModal
      withoutAnimationWhenOpen
      isOpen={isHelpRepresentativeModalOpen}
      setIsOpen={setIsHelpRepresentativeModalOpen}
      maxWidth={helpModalWidth}
      onBackButtonClick={handleClick}
      withCloseButton>
      <HelpModalContainer>
        <h1>Hello</h1>
      </HelpModalContainer>
    </BasicModal>
  );
}
