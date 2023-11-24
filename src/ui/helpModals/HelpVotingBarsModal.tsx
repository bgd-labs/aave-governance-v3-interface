import { Box, useTheme } from '@mui/system';

import { selectConfigByAccessLevel } from '../../proposals/store/proposalsSelectors';
import { useStore } from '../../store';
import { BasicModal, BigButton } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';

export function HelpVotingBarsModal() {
  const theme = useTheme();

  const {
    isHelpVotingBarsModalOpen,
    setIsHelpVotingBarsModalOpen,
    setIsHelpVotingModalOpen,
  } = useStore();
  const config = useStore((state) => selectConfigByAccessLevel(state, 1));

  if (!config) return null;

  const handleClick = () => {
    setIsHelpVotingBarsModalOpen(false);
    setIsHelpVotingModalOpen(true);
  };

  return (
    <BasicModal
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
            <HelpModalText mb={12}>
              {texts.faq.votingBars.description}
            </HelpModalText>
            <HelpModalText>
              <span
                dangerouslySetInnerHTML={{
                  __html: texts.faq.votingBars.secondDescription(
                    config.quorum,
                    config.differential,
                  ),
                }}
              />
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
