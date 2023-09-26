import { Box, useTheme } from '@mui/system';

import { useStore } from '../../store';
import { BasicModal, BigButton } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { assets } from './assets';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';

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
      withoutAnimationWhenOpen
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
            <Box
              component="p"
              sx={{
                mb: 12,
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.entireBalance(assets)}
            </Box>
            <Box
              component="p"
              sx={{
                mb: 12,
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              <b>{texts.faq.delegate.warning}</b>{' '}
              {texts.faq.delegate.propositionPowerFirstWarning}
            </Box>
            <Box
              component="p"
              sx={{
                mb: 12,
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.delegate.propositionPowerSecondWarning}
            </Box>

            <BigButton alwaysWithBorders onClick={handleClick} css={{ mt: 24 }}>
              {texts.faq.other.gotIt}
            </BigButton>
          </Box>
        </HelpModalCaption>
      </HelpModalContainer>
    </BasicModal>
  );
}
