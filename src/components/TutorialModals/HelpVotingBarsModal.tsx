import { Box, useTheme } from '@mui/system';

import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { BasicModal } from '../BasicModal';
import { BigButton } from '../BigButton';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';

export function HelpVotingBarsModal() {
  const theme = useTheme();

  const isHelpVotingBarsModalOpen = useStore(
    (store) => store.isHelpVotingBarsModalOpen,
  );
  const setIsHelpVotingBarsModalOpen = useStore(
    (store) => store.setIsHelpVotingBarsModalOpen,
  );
  const setIsHelpVotingModalOpen = useStore(
    (store) => store.setIsHelpVotingModalOpen,
  );
  const config = useStore((store) => store.configs)?.configs.filter(
    (config) => config.accessLevel === 1,
  )[0];

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
                    ? `url('/helpModals/votingBarsDark.svg')`
                    : `url('/helpModals/votingBars.svg')`,
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
                    Number(config.quorum),
                    Number(config.differential),
                  ),
                }}
              />
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
