import { Box, useTheme } from '@mui/system';

import { useStore } from '../../store';
import { BasicModal, BigButton } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { assets } from './assets';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';

export function HelpVotingPowerModal() {
  const theme = useTheme();

  const {
    isHelpVotingPowerModalOpen,
    setIsHelpVotingPowerModalOpen,
    setIsHelpVotingModalOpen,
  } = useStore();

  const handleClick = () => {
    setIsHelpVotingPowerModalOpen(false);
    setIsHelpVotingModalOpen(true);
  };

  return (
    <BasicModal
      withoutAnimationWhenOpen
      isOpen={isHelpVotingPowerModalOpen}
      setIsOpen={setIsHelpVotingPowerModalOpen}
      maxWidth={helpModalWidth}
      onBackButtonClick={handleClick}
      withCloseButton>
      <HelpModalContainer>
        <HelpModalCaption
          caption={texts.faq.votingPower.title}
          image={
            <Box
              sx={{
                width: 290,
                height: 270,
                background:
                  theme.palette.mode === 'dark'
                    ? `url(${setRelativePath(
                        '/images/helpModals/votingPowerDark.svg',
                      )})`
                    : `url(${setRelativePath(
                        '/images/helpModals/votingPower.svg',
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
                lineHeight: '20px !important',
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.votingPower.description(assets)}
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
