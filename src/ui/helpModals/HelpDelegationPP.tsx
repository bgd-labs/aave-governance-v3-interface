import { Box, useTheme } from '@mui/system';

import { useStore } from '../../store/ZustandStoreProvider';
import { BasicModal, BigButton } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { assets } from './assets';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';

export function HelpDelegationPP() {
  const theme = useTheme();

  const isHelpDelegationPropositionPowerModalOpen = useStore(
    (store) => store.isHelpDelegationPropositionPowerModalOpen,
  );
  const setIsHelpDelegationPropositionPowerModalOpen = useStore(
    (store) => store.setIsHelpDelegationPropositionPowerModalOpen,
  );
  const setIsHelpDelegateModalOpen = useStore(
    (store) => store.setIsHelpDelegateModalOpen,
  );

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

            <Box sx={{ mt: 24, minHeight: 60 }}>
              <BigButton alwaysWithBorders onClick={handleClick}>
                {texts.faq.other.gotIt}
              </BigButton>
            </Box>
          </Box>
        </HelpModalCaption>
      </HelpModalContainer>
    </BasicModal>
  );
}
