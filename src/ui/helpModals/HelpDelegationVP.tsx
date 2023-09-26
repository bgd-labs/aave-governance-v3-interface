import { Box, useTheme } from '@mui/system';

import { useStore } from '../../store';
import { BasicModal, BigButton } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { assets } from './assets';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';

export function HelpDelegationVP() {
  const theme = useTheme();

  const {
    isHelpDelegationVotingPowerModalOpen,
    setIsHelpDelegationVotingPowerModalOpen,
    setIsHelpDelegateModalOpen,
  } = useStore();

  const handleClick = () => {
    setIsHelpDelegationVotingPowerModalOpen(false);
    setIsHelpDelegateModalOpen(true);
  };

  return (
    <BasicModal
      withoutAnimationWhenOpen
      isOpen={isHelpDelegationVotingPowerModalOpen}
      setIsOpen={setIsHelpDelegationVotingPowerModalOpen}
      maxWidth={helpModalWidth}
      onBackButtonClick={handleClick}
      withCloseButton>
      <HelpModalContainer>
        <HelpModalCaption
          caption="Delegation of voting power"
          image={
            <Box
              sx={{
                width: 290,
                height: 270,
                background:
                  theme.palette.mode === 'dark'
                    ? `url(${setRelativePath(
                        '/images/helpModals/delegationVotingPowerDark.svg',
                      )})`
                    : `url(${setRelativePath(
                        '/images/helpModals/delegationVotingPower.svg',
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
                typography: 'body',
                mb: 12,
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
                typography: 'body',
                mb: 12,
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              <b>{texts.faq.delegate.warning}</b>{' '}
              {texts.faq.delegate.votingPowerWarning}
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
