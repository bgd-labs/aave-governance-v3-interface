import { Box, useTheme } from '@mui/system';
import React, { useRef } from 'react';

import { useStore } from '../../store';
import { BasicModal, BigButton } from '../../ui';
import { setRelativePath } from '../../ui/utils/relativePath';
import { texts } from '../../ui/utils/texts';

export function RepresentationInfoModal() {
  const theme = useTheme();

  const {
    isRepresentationInfoModalOpen,
    setIsRepresentationInfoModalOpen,
    setAccountInfoModalOpen,
  } = useStore();
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
          px: 25,
          pt: 15,
          pb: 35,
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
            mb: 28,
            mt: 5,
            textAlign: 'center',
            typography: 'body',
            lineHeight: '20px !important',
            [theme.breakpoints.up('lg')]: {
              typography: 'body',
              lineHeight: '22px !important',
            },
          }}>
          {texts.representationsPage.representationInfo}
        </Box>
        <Box>
          <BigButton
            color="white"
            css={{ mr: 16 }}
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
