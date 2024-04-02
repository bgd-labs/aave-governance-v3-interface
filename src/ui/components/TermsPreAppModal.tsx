import { Box, useTheme } from '@mui/system';
import React, { useRef, useState } from 'react';

import { useRootStore } from '../../store/storeProvider';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { BasicModal } from './BasicModal';
import { BigButton } from './BigButton';
import { CheckBox } from './CheckBox';

export function TermsPreAppModal() {
  const theme = useTheme();

  const setIsTermsAccept = useRootStore((store) => store.setIsTermsAccept);
  const setIsTermModalOpen = useRootStore((store) => store.setIsTermModalOpen);
  const isAppBlockedByTerms = useRootStore(
    (store) => store.isAppBlockedByTerms,
  );

  const initialFocusRef = useRef(null);

  const [isCheckBoxClicked, setIsCheckBoxClicked] = useState(false);

  return (
    <BasicModal
      modalCss={{
        zIndex: 101,
      }}
      initialFocus={initialFocusRef}
      isOpen={isAppBlockedByTerms}
      setIsOpen={setIsTermsAccept}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Box
          sx={{
            width: 240,
            height: 220,
            background:
              theme.palette.mode === 'dark'
                ? `url(${setRelativePath('/images/TermsDark.svg')})`
                : `url(${setRelativePath('/images/Terms.svg')})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <Box sx={{ minHeight: 190, textAlign: 'left', mt: 10 }}>
          <Box sx={{ mb: 28, lineHeight: '22px' }}>
            {texts.terms.description}
          </Box>

          <Box
            onClick={() => setIsCheckBoxClicked(!isCheckBoxClicked)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              cursor: 'pointer',
              typography: 'descriptor',
              hover: {
                '.CheckBox': {
                  background: theme.palette.$disabled,
                },
              },
            }}>
            <CheckBox value={isCheckBoxClicked} />
            {texts.terms.checkBoxLabel}{' '}
            <Box
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsTermModalOpen(true);
              }}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ml: 3,
                textDecoration: 'underline',
                color: '$text',
                hover: { color: theme.palette.$textSecondary },
              }}>
              {texts.terms.terms}
            </Box>
            .
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 40,
            }}>
            <BigButton
              disabled={!isCheckBoxClicked}
              onClick={() => setIsTermsAccept(true)}>
              {texts.terms.buttonTitle}
            </BigButton>
          </Box>
        </Box>
      </Box>
    </BasicModal>
  );
}
