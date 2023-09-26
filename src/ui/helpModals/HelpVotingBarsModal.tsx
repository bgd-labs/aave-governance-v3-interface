import { Box, useTheme } from '@mui/system';

import { selectConfigByAccessLevel } from '../../proposals/store/proposalsSelectors';
import { useStore } from '../../store';
import { BasicModal, BigButton } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';

export function HelpVotingBarsModal() {
  const theme = useTheme();

  const {
    isHelpVotingBarsModalOpen,
    setIsHelpVotingBarsModalOpen,
    setIsHelpVotingModalOpen,
  } = useStore();
  const config = useStore((state) => selectConfigByAccessLevel(state, 1));

  const handleClick = () => {
    setIsHelpVotingBarsModalOpen(false);
    setIsHelpVotingModalOpen(true);
  };

  return (
    <BasicModal
      withoutAnimationWhenOpen
      isOpen={isHelpVotingBarsModalOpen}
      setIsOpen={setIsHelpVotingBarsModalOpen}
      maxWidth={helpModalWidth}
      onBackButtonClick={handleClick}
      withCloseButton>
      <HelpModalContainer>
        <HelpModalCaption
          caption={texts.faq.votingBars.title}
          image={
            <Box
              sx={{
                width: 290,
                height: 270,
                background:
                  theme.palette.mode === 'dark'
                    ? `url(${setRelativePath(
                        '/images/helpModals/votingBarsDark.svg',
                      )})`
                    : `url(${setRelativePath(
                        '/images/helpModals/votingBars.svg',
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
              {texts.faq.votingBars.description}
            </Box>
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
              <span
                dangerouslySetInnerHTML={{
                  __html: texts.faq.votingBars.secondDescription(
                    config.quorum,
                    config.differential,
                  ),
                }}
              />
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
