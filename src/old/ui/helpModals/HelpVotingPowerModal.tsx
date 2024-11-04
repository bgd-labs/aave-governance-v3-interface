import { Box, useTheme } from '@mui/system';

import { useStore } from '../../store/ZustandStoreProvider';
import { BasicModal, BigButton } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { assets } from './assets';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';

export function HelpVotingPowerModal() {
  const theme = useTheme();

  const isHelpVotingPowerModalOpen = useStore(
    (store) => store.isHelpVotingPowerModalOpen,
  );
  const setIsHelpVotingPowerModalOpen = useStore(
    (store) => store.setIsHelpVotingPowerModalOpen,
  );
  const setIsHelpVotingModalOpen = useStore(
    (store) => store.setIsHelpVotingModalOpen,
  );

  const handleClick = () => {
    setIsHelpVotingPowerModalOpen(false);
    setIsHelpVotingModalOpen(true);
  };

  return (
    <BasicModal
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
            <HelpModalText>
              {texts.faq.votingPower.description(assets)}
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
