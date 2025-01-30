import { Box, useTheme } from '@mui/system';

import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { BasicModal } from '../BasicModal';
import { BigButton } from '../BigButton';
import { assets } from './assets';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';

export function HelpDelegationVP() {
  const theme = useTheme();

  const isHelpDelegationVotingPowerModalOpen = useStore(
    (store) => store.isHelpDelegationVotingPowerModalOpen,
  );
  const setIsHelpDelegationVotingPowerModalOpen = useStore(
    (store) => store.setIsHelpDelegationVotingPowerModalOpen,
  );
  const setIsHelpDelegateModalOpen = useStore(
    (store) => store.setIsHelpDelegateModalOpen,
  );

  const handleClick = () => {
    setIsHelpDelegationVotingPowerModalOpen(false);
    setIsHelpDelegateModalOpen(true);
  };

  return (
    <BasicModal
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
                    ? `url('/helpModals/delegationVotingPowerDark.svg')`
                    : `url('/helpModals/delegationVotingPower.svg')`,
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
              {texts.faq.delegate.votingPowerWarning}
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
