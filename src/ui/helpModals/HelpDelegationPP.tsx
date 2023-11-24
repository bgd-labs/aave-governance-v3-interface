import { Box, useTheme } from '@mui/system';

import { useStore } from '../../store';
import { BasicModal, BigButton } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { assets } from './assets';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';

export function HelpDelegationPP() {
  const theme = useTheme();

  const {
    isHelpDelegationPropositionPowerModalOpen,
    setIsHelpDelegationPropositionPowerModalOpen,
    setIsHelpDelegateModalOpen,
  } = useStore();

  const handleClick = () => {
    setIsHelpDelegationPropositionPowerModalOpen(false);
    setIsHelpDelegateModalOpen(true);
  };

  return (
    <BasicModal
      isOpen={isHelpDelegationPropositionPowerModalOpen}
      setIsOpen={setIsHelpDelegationPropositionPowerModalOpen}
      maxWidth={helpModalWidth}
      onBackButtonClick={handleClick}
      withCloseButton>
      <HelpModalContainer>
        <HelpModalCaption
          caption="Delegation proposition power"
          image={
            <Box
              sx={{
                width: 290,
                height: 270,
                background:
                  theme.palette.mode === 'dark'
                    ? `url(${setRelativePath(
                        '/images/helpModals/delegationPropositionPowerDark.svg',
                      )})`
                    : `url(${setRelativePath(
                        '/images/helpModals/delegationPropositionPower.svg',
                      )})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          }>
          <Box sx={{ maxWidth: 480 }}>
            <HelpModalText mb={12}>
              {texts.faq.delegate.entireBalance(assets)}
            </HelpModalText>
            <HelpModalText mb={12}>
              <b>{texts.faq.delegate.warning}</b>{' '}
              {texts.faq.delegate.propositionPowerFirstWarning}
            </HelpModalText>
            <HelpModalText mb={12}>
              {texts.faq.delegate.propositionPowerSecondWarning}
            </HelpModalText>

            <BigButton alwaysWithBorders onClick={handleClick} css={{ mt: 24 }}>
              {texts.faq.other.gotIt}
            </BigButton>
          </Box>
        </HelpModalCaption>
      </HelpModalContainer>
    </BasicModal>
  );
}
