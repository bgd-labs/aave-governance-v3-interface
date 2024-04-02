import { Box, useTheme } from '@mui/system';
import React, { useRef } from 'react';

import { useRootStore } from '../../store/storeProvider';
import { BasicModal, BigButton } from '../../ui';
import { setRelativePath } from '../../ui/utils/relativePath';
import { texts } from '../../ui/utils/texts';

export function RepresentationInfoModal() {
  const theme = useTheme();

  const isRepresentationInfoModalOpen = useRootStore(
    (store) => store.isRepresentationInfoModalOpen,
  );
  const setIsRepresentationInfoModalOpen = useRootStore(
    (store) => store.setIsRepresentationInfoModalOpen,
  );
  const setAccountInfoModalOpen = useRootStore(
    (store) => store.setAccountInfoModalOpen,
  );

  const initialFocusRef = useRef(null);

  return (
    <BasicModal
      initialFocus={initialFocusRef}
      isOpen={isRepresentationInfoModalOpen}
      setIsOpen={setIsRepresentationInfoModalOpen}
      maxWidth={500}
      withCloseButton>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box
          ref={initialFocusRef}
          sx={{
            width: 220,
            height: 200,
            background:
              theme.palette.mode === 'dark'
                ? `url(${setRelativePath(
                    '/images/helpModals/representativesDoneDark.svg',
                  )})`
                : `url(${setRelativePath(
                    '/images/helpModals/representativesDone.svg',
                  )})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            [theme.breakpoints.up('sm')]: { width: 290, height: 270 },
          }}
        />
        <Box
          sx={{
            mb: 24,
            mt: 8,
            textAlign: 'center',
            typography: 'body',
          }}>
          {texts.representationsPage.representationInfo}
        </Box>
        <Box>
          <BigButton
            color="white"
            css={{ mr: 24 }}
            onClick={() => setIsRepresentationInfoModalOpen(false)}>
            {texts.other.close}
          </BigButton>
          <BigButton
            onClick={() => {
              setIsRepresentationInfoModalOpen(false);
              setAccountInfoModalOpen(true);
            }}>
            {texts.other.wallet}
          </BigButton>
        </Box>
      </Box>
    </BasicModal>
  );
}
