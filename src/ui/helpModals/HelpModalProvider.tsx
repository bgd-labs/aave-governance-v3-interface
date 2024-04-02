import { Box, useTheme } from '@mui/system';
import { useEffect, useState } from 'react';

import { useRootStore } from '../../store/storeProvider';
import { BigButton } from '../components/BigButton';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { HelpDelegateModal } from './HelpDelegateModal';
import { HelpDelegationPP } from './HelpDelegationPP';
import { HelpDelegationVP } from './HelpDelegationVP';
import { HelpModalNavigation, InfoType } from './HelpModalNavigation';
import { HelpModalText } from './HelpModalText';
import { HelpModalWrapper } from './HelpModalWrapper';
import { HelpRepresentationModal } from './HelpRepresentationModal';
import { HelpRepresentativeModal } from './HelpRepresentativeModal';
import { HelpStatusesModal } from './HelpStatusesModal';
import { HelpVotingBarsModal } from './HelpVotingBarsModal';
import { HelpVotingModal } from './HelpVotingModal';
import { HelpVotingPowerModal } from './HelpVotingPowerModal';
import { HelpWalletModal } from './HelpWalletModal';

export function HelpModalProvider() {
  const theme = useTheme();

  const setIsHelpModalOpen = useRootStore((store) => store.setIsHelpModalOpen);
  const isModalOpen = useRootStore((store) => store.isModalOpen);
  const setIsHelpNavigationModalOpen = useRootStore(
    (store) => store.setIsHelpNavigationModalOpen,
  );
  const setIsClickedOnStartButtonOnHelpModal = useRootStore(
    (store) => store.setIsClickedOnStartButtonOnHelpModal,
  );
  const closeHelpModals = useRootStore((store) => store.closeHelpModals);
  const isClickedOnStartButtonOnHelpModal = useRootStore(
    (store) => store.isClickedOnStartButtonOnHelpModal,
  );

  const [infoType, setInfoType] = useState<InfoType | undefined>(undefined);

  useEffect(() => {
    setInfoType(undefined);
  }, [isModalOpen]);

  return (
    <>
      <HelpModalWrapper
        image={
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background:
                theme.palette.mode === 'dark'
                  ? `url(${setRelativePath('/images/helpModals/mainDark.svg')})`
                  : `url(${setRelativePath('/images/helpModals/main.svg')})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        }>
        <Box>
          <Box component="h2" sx={{ typography: 'h1', mb: 12 }}>
            {texts.faq.welcome.title}
          </Box>
          <HelpModalText>{texts.faq.welcome.description}</HelpModalText>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 32 }}>
            <BigButton
              alwaysWithBorders
              color="white"
              onClick={() => {
                closeHelpModals();
                setIsHelpModalOpen(false);
              }}>
              {texts.faq.welcome.closeButtonTitle}
            </BigButton>
            <BigButton
              alwaysWithBorders
              css={{ ml: 8 }}
              onClick={() => {
                setIsClickedOnStartButtonOnHelpModal(true);
                setIsHelpNavigationModalOpen(true);
              }}>
              {texts.faq.welcome.nextButtonTitle}
            </BigButton>
          </Box>
        </Box>
      </HelpModalWrapper>

      <HelpModalNavigation setInfoType={setInfoType} />

      {isClickedOnStartButtonOnHelpModal && (
        <>
          <HelpWalletModal infoType={infoType} />
          <HelpVotingModal />
          <HelpDelegateModal infoType={infoType} />
          <HelpRepresentativeModal />
          <HelpRepresentationModal infoType={infoType} />
          <HelpStatusesModal infoType={infoType} />
          <HelpVotingPowerModal />
          <HelpVotingBarsModal />
          <HelpDelegationVP />
          <HelpDelegationPP />
        </>
      )}
    </>
  );
}
