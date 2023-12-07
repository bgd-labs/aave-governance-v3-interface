import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import { avalanche, mainnet, polygon } from 'viem/chains';

import { RepresentedAddress } from '../../representations/store/representationsSlice';
import { useStore } from '../../store';
import { AccountInfoModalContent } from '../../web3/components/wallet/AccountInfoModalContent';
import { BasicModal, BigButton, BoxWith3D } from '../';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useMediaQuery } from '../utils/useMediaQuery';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';
import { HelpModalTooltip } from './HelpModalTooltip';

const testRepresentedAddresses: RepresentedAddress[] = [
  {
    chainId: avalanche.id,
    address: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b',
  },
  {
    chainId: mainnet.id,
    address: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b',
  },
  {
    chainId: polygon.id,
    address: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b',
  },
  {
    chainId: polygon.id,
    address: '0xC53e0A6EC3c116F350F11a01B39DFEAd078979B3',
  },
  {
    chainId: avalanche.id,
    address: '0x4bEC29424b47586817e302249184C7cBfec730CD',
  },
  {
    chainId: polygon.id,
    address: '0x4bEC29424b47586817e302249184C7cBfec730CD',
  },
  {
    chainId: avalanche.id,
    address: '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97',
  },
];

export function HelpRepresentativeModal() {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const {
    isHelpRepresentativeModalOpen,
    setIsHelpRepresentativeModalOpen,
    setIsHelpNavigationModalOpen,
    setIsHelpDelegateModalOpen,
    setIsHelpRepresentationModalOpen,
  } = useStore();

  const [isFirstStepOnMobile, setIsFirstStepOnMobile] = useState(true);

  useEffect(() => {
    if (!sm) {
      setIsFirstStepOnMobile(true);
    } else {
      setIsFirstStepOnMobile(false);
    }
  }, [sm]);

  const handleBackButtonClick = () => {
    if (!isFirstStepOnMobile) {
      setIsFirstStepOnMobile(true);
    } else {
      setIsHelpRepresentativeModalOpen(false);
      setIsHelpNavigationModalOpen(true);
    }
  };

  return (
    <BasicModal
      isOpen={isHelpRepresentativeModalOpen}
      setIsOpen={setIsHelpRepresentativeModalOpen}
      maxWidth={helpModalWidth}
      onBackButtonClick={handleBackButtonClick}
      withCloseButton>
      <HelpModalContainer>
        <Box
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 18,
            display: isFirstStepOnMobile ? 'flex' : 'none',
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
          }}>
          <Box component="h2" sx={{ typography: 'h1', mb: 18 }}>
            {texts.faq.representative.title}
          </Box>
          <Box
            sx={{
              width: '100%',
              height: 240,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background:
                  theme.palette.mode === 'dark'
                    ? `url(${setRelativePath(
                        '/images/helpModals/wallet1_mobileDark.svg',
                      )})`
                    : `url(${setRelativePath(
                        '/images/helpModals/wallet1_mobile.svg',
                      )})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </Box>
          <HelpModalText>
            {texts.faq.representative.descriptionFirst}
          </HelpModalText>
          <BigButton
            alwaysWithBorders
            onClick={() => setIsFirstStepOnMobile(false)}
            css={{ mt: 24 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Box component="p" sx={{ typography: 'body' }}>
                {texts.faq.other.next}
              </Box>
            </Box>
          </BigButton>
        </Box>

        <Box
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            display: isFirstStepOnMobile ? 'none' : 'flex',
            [theme.breakpoints.up('sm')]: {
              display: 'flex',
            },
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
            },
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', order: 1 }}>
            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('md')]: {
                  display: 'flex',
                  width: 290,
                  height: 500,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  left: 0,
                },
              }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background:
                    theme.palette.mode === 'dark'
                      ? `url(${setRelativePath(
                          '/images/helpModals/RepresentatiivesWalletDark.svg',
                        )})`
                      : `url(${setRelativePath(
                          '/images/helpModals/RepresentatiivesWallet.svg',
                        )})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </Box>

            <Box
              sx={{
                width: '100%',
                [theme.breakpoints.up('md')]: {
                  width: 620,
                  ml: 8,
                },
                [theme.breakpoints.up('lg')]: {
                  width: 720,
                  ml: 10,
                },
              }}>
              <Box
                sx={{
                  mb: 18,
                  display: isFirstStepOnMobile ? 'none' : 'block',
                  [theme.breakpoints.up('sm')]: {
                    display: 'block',
                  },
                  [theme.breakpoints.up('lg')]: {
                    mb: 24,
                  },
                }}>
                <Box
                  component="h2"
                  sx={{
                    typography: 'h1',
                    mb: 18,
                    textAlign: 'center',
                    [theme.breakpoints.up('sm')]: {
                      typography: 'h1',
                      textAlign: 'left',
                    },
                    [theme.breakpoints.up('lg')]: {
                      typography: 'h1',
                      mb: 24,
                    },
                  }}>
                  {texts.faq.representative.title}
                </Box>
              </Box>

              <Box sx={{ position: 'relative' }}>
                <HelpModalTooltip
                  maxWidth={400}
                  mobileBottomPadding={25}
                  css={{
                    position: 'absolute',
                    left: 10,
                    top: 110,
                    [theme.breakpoints.up('xsm')]: {
                      left: 184,
                      top: 76,
                    },
                    [theme.breakpoints.up('lg')]: {
                      left: '200px !important',
                      top: '82px !important',
                    },

                    '.HelpModalTooltip__content': {
                      width: 240,
                      '> div': {
                        p: '15px 5px 10px 5px',
                        [theme.breakpoints.up('sm')]: {
                          p: '0',
                        },
                      },
                      [theme.breakpoints.up('sm')]: {
                        width: 283,
                      },
                      [theme.breakpoints.up('lg')]: {
                        width: 310,
                      },
                    },
                  }}>
                  <Box component="p" sx={{ typography: 'body' }}>
                    {texts.faq.representative.firstTooltip}
                  </Box>
                </HelpModalTooltip>

                <HelpModalTooltip
                  countNumber={2}
                  maxWidth={400}
                  mobileBottomPadding={33}
                  css={{
                    position: 'absolute',
                    left: -5,
                    top: 229,
                    [theme.breakpoints.up('xsm')]: {
                      top: 168,
                    },
                    [theme.breakpoints.up('sm')]: {
                      top: 176,
                    },
                    [theme.breakpoints.up('lg')]: {
                      top: '186px !important',
                    },
                    '.HelpModalTooltip__content': {
                      width: 380,
                      [theme.breakpoints.up('sm')]: { width: 400 },
                    },
                  }}>
                  <Box component="p" sx={{ typography: 'body' }}>
                    {texts.faq.representative.secondTooltip}
                  </Box>
                </HelpModalTooltip>

                <BoxWith3D
                  alwaysWithBorders
                  borderSize={8}
                  contentColor="$mainLight"
                  css={{
                    p: 18,
                    width: '100%',
                    [theme.breakpoints.up('lg')]: { p: '24px 30px' },
                  }}>
                  <AccountInfoModalContent
                    activeAddress={zeroAddress}
                    ensName={zeroAddress}
                    chainId={1}
                    isActive={true}
                    allTransactions={[]}
                    onDelegateButtonClick={() => {
                      setIsHelpRepresentativeModalOpen(false);
                      setIsHelpDelegateModalOpen(true);
                    }}
                    onRepresentationsButtonClick={() => {
                      setIsHelpRepresentativeModalOpen(false);
                      setIsHelpRepresentationModalOpen(true);
                    }}
                    onDisconnectButtonClick={handleBackButtonClick}
                    onAllTransactionButtonClick={() =>
                      console.info(
                        'transaction button click from representative help modal',
                      )
                    }
                    forTest
                    representedAddresses={testRepresentedAddresses}
                  />
                </BoxWith3D>

                <Box
                  sx={{
                    mt: 18,
                    display: isFirstStepOnMobile ? 'none' : 'block',
                    [theme.breakpoints.up('sm')]: {
                      display: 'block',
                    },
                    [theme.breakpoints.up('lg')]: {
                      mt: 24,
                    },
                  }}>
                  <Box
                    component="p"
                    sx={{
                      display: 'none',
                      [theme.breakpoints.up('sm')]: {
                        display: 'block',
                        typography: 'body',
                        mb: 12,
                      },
                    }}>
                    {texts.faq.representative.descriptionFirst}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      typography: 'body',
                      textAlign: 'center',
                      [theme.breakpoints.up('sm')]: {
                        textAlign: 'left',
                      },
                    }}>
                    {texts.faq.representative.descriptionSecond}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </HelpModalContainer>
    </BasicModal>
  );
}
