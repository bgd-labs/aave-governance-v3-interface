import { ChainIdByName } from '@bgd-labs/aave-governance-ui-helpers/src/helpers/chains';
import { Box, useTheme } from '@mui/system';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import RepresentatiivesWalletImage from '/public/images/helpModals/RepresentatiivesWallet.svg';
import RepresentatiivesWalletImageDark from '/public/images/helpModals/RepresentatiivesWalletDark.svg';
import ArrowToRight from '/public/images/icons/arrowToRightW.svg';

import { RepresentedAddress } from '../../representations/store/representationsSlice';
import { useStore } from '../../store';
import { AccountInfoModalContent } from '../../web3/components/wallet/AccountInfoModalContent';
import { BasicModal, BigButton, BoxWith3D } from '../';
import { IconBox } from '../primitives/IconBox';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useMediaQuery } from '../utils/useMediaQuery';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';
import { HelpModalTooltip } from './HelpModalTooltip';

const testRepresentedAddresses: RepresentedAddress[] = [
  {
    chainId: ChainIdByName.Avalanche,
    address: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b',
  },
  {
    chainId: ChainIdByName.EthereumMainnet,
    address: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b',
  },
  {
    chainId: ChainIdByName.Polygon,
    address: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b',
  },
  {
    chainId: ChainIdByName.Polygon,
    address: '0xC53e0A6EC3c116F350F11a01B39DFEAd078979B3',
  },
  {
    chainId: ChainIdByName.Avalanche,
    address: '0x4bEC29424b47586817e302249184C7cBfec730CD',
  },
  {
    chainId: ChainIdByName.Polygon,
    address: '0x4bEC29424b47586817e302249184C7cBfec730CD',
  },
  {
    chainId: ChainIdByName.Avalanche,
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
      withoutAnimationWhenOpen
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
            py: 20,
            display: isFirstStepOnMobile ? 'flex' : 'none',
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
          }}>
          <Box component="h2" sx={{ typography: 'h1', mb: 10 }}>
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
                        '/images/helpModals/representativesWallet_mobileDark.svg',
                      )})`
                    : `url(${setRelativePath(
                        '/images/helpModals/representativesWallet_mobile.svg',
                      )})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </Box>
          <HelpModalText>
            {texts.faq.representative.descriptionMobileFirst}
          </HelpModalText>
          <BigButton
            alwaysWithBorders
            onClick={() => setIsFirstStepOnMobile(false)}
            css={{ mt: 30 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                svg: { path: { fill: theme.palette.$textWhite } },
              }}>
              <Box component="p" sx={{ typography: 'body' }}>
                {texts.faq.other.next}
              </Box>
              <IconBox
                sx={{
                  width: 20,
                  height: 20,
                  ml: 10,
                  '> svg': { width: 20, height: 20 },
                }}>
                <ArrowToRight />
              </IconBox>
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
                [theme.breakpoints.up('sm')]: {
                  display: 'flex',
                  width: 290,
                  maxHeight: 500,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  left: 0,
                },
              }}>
              <IconBox
                sx={{
                  width: '100%',
                  height: '100%',
                  maxHeight: 500,
                  '> svg': {
                    width: '100%',
                    height: '100%',
                    maxHeight: 500,
                  },
                }}>
                <>
                  {theme.palette.mode === 'dark' ? (
                    <RepresentatiivesWalletImageDark />
                  ) : (
                    <RepresentatiivesWalletImage />
                  )}
                </>
              </IconBox>
            </Box>

            <Box
              sx={{
                width: 375,
                mt: 20,
                [theme.breakpoints.up('sm')]: {
                  width: 410,
                },
                [theme.breakpoints.up('md')]: {
                  mr: 20,
                  ml: 8,
                },
                [theme.breakpoints.up('lg')]: {
                  width: 460,
                  mr: 30,
                  ml: 10,
                },
              }}>
              <Box
                component="h2"
                sx={{
                  typography: 'h1',
                  mb: 22,
                  textAlign: 'center',
                  display: isFirstStepOnMobile ? 'none' : 'block',
                  [theme.breakpoints.up('sm')]: {
                    display: 'none',
                  },
                }}>
                {texts.faq.representative.title}
              </Box>
              <Box sx={{ position: 'relative' }}>
                <HelpModalTooltip
                  maxWidth={400}
                  mobileBottomPadding={25}
                  css={{
                    position: 'absolute',
                    left: -15,
                    top: 95,
                    [theme.breakpoints.up('lg')]: { left: -10, top: 100 },
                    '.HelpModalTooltip__content': {
                      width: 390,
                      [theme.breakpoints.up('sm')]: { width: 400 },
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
                    left: -15,
                    top: 200,
                    [theme.breakpoints.up('lg')]: { top: 197 },
                    [theme.breakpoints.up('lg')]: { left: -10, top: 205 },
                    '.HelpModalTooltip__content': {
                      width: 390,
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
                    p: '40px 15px 20px',
                    [theme.breakpoints.up('lg')]: { p: '50px 35px 30px' },
                  }}>
                  <AccountInfoModalContent
                    activeAddress={ethers.constants.AddressZero}
                    ensName={ethers.constants.AddressZero}
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
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              width: '100%',
              mt: 20,
              textAlign: 'center',
              order: 3,
              [theme.breakpoints.up('sm')]: {
                order: 0,
              },
              [theme.breakpoints.up('md')]: {
                width: 280,
                order: 3,
                mt: 0,
                textAlign: 'left',
              },
            }}>
            <Box
              component="h2"
              sx={{
                mb: 20,
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                  typography: 'h1',
                  display: 'block',
                },
              }}>
              {texts.faq.representative.title}
            </Box>
            <Box
              component="p"
              sx={{
                typography: 'body',
                lineHeight: '20px !important',
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                  display: 'inline-block',
                },
                [theme.breakpoints.up('lg')]: {
                  typography: 'body',
                  lineHeight: '26px !important',
                },
              }}>
              {texts.faq.representative.description}
            </Box>
            <Box
              component="p"
              sx={{
                typography: 'body',
                lineHeight: '20px !important',
                [theme.breakpoints.up('sm')]: {
                  display: 'none',
                },
              }}>
              {texts.faq.representative.descriptionMobileSecond}
            </Box>
          </Box>
        </Box>
      </HelpModalContainer>
    </BasicModal>
  );
}
