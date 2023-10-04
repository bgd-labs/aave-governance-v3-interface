import { Box, useTheme } from '@mui/system';
import { useEffect, useState } from 'react';

import { useStore } from '../../store';
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

type IsHelpModalVisible = 'true' | 'false';

export function HelpModalProvider() {
  const theme = useTheme();
  const {
    setIsHelpModalOpen,
    isModalOpen,
    setIsHelpNavigationModalOpen,
    setIsClickedOnStartButtonOnHelpModal,
    isAppBlockedByTerms,
    isRendered,
    closeHelpModals,
    isClickedOnStartButtonOnHelpModal,
  } = useStore();

  const [infoType, setInfoType] = useState<InfoType | undefined>(undefined);

  useEffect(() => {
    const isHelpModalVisible = localStorage?.getItem(
      'isHelpModalVisible',
    ) as IsHelpModalVisible;

    if (isHelpModalVisible && !isAppBlockedByTerms) {
      setIsHelpModalOpen(isHelpModalVisible === 'true');
    } else if (!isClickedOnStartButtonOnHelpModal) {
      setIsHelpModalOpen(!isAppBlockedByTerms);
    }
  }, [isRendered]);

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
                localStorage?.setItem('isHelpModalVisible', 'false');
                closeHelpModals();
                setIsHelpModalOpen(false);
              }}>
              {texts.faq.welcome.closeButtonTitle}
            </BigButton>
            <BigButton
              alwaysWithBorders
              css={{ ml: 8 }}
              onClick={() => {
                localStorage?.setItem('isHelpModalVisible', 'false');
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
