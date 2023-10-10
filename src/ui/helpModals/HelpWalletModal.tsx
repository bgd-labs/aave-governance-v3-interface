import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import WalletFirstImage from '/public/images/helpModals/wallet1.svg';
import WalletFirstImageDark from '/public/images/helpModals/wallet1Dark.svg';
import WalletSecondImage from '/public/images/helpModals/wallet2.svg';
import WalletSecondImageDark from '/public/images/helpModals/wallet2Dark.svg';
import ArrowToRight from '/public/images/icons/arrowToRightW.svg';

import { useStore } from '../../store';
import { TransactionsModalContent } from '../../transactions/components/TransactionsModalContent';
import { AccountInfoModalContent } from '../../web3/components/wallet/AccountInfoModalContent';
import { wallets } from '../../web3/components/wallet/ConnectWalletModal';
import { ConnectWalletModalContent } from '../../web3/components/wallet/ConnectWalletModalContent';
import { BigButton, BoxWith3D } from '../';
import { BasicModal } from '../components/BasicModal';
import { IconBox } from '../primitives/IconBox';
import { selectAllTestTransactions } from '../store/uiSelectors';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useMediaQuery } from '../utils/useMediaQuery';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { InfoType } from './HelpModalNavigation';
import { HelpModalText } from './HelpModalText';

interface HelpWalletModalProps {
  infoType?: InfoType;
}

export function HelpWalletModal({ infoType }: HelpWalletModalProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const {
    isHelpWalletModalOpen,
    setIsHelpWalletModalOpen,
    setIsHelpDelegateModalOpen,
    isHelpModalClosed,
    setIsHelpVotingModalOpen,
    setIsHelpNavigationModalOpen,
    resetTestTransactionsPool,
    addTestTransaction,
    setIsHelpRepresentationModalOpen,
  } = useStore();

  const allTestTransaction = useStore((state) =>
    selectAllTestTransactions(state),
  );

  const [activeWallet, setActiveWallet] = useState('');
  const [walletActivating, setWalletActivating] = useState(false);
  const [allTransactionVisible, setAllTransactionsVisible] = useState(false);
  const [isFirstStepOnMobile, setIsFirstStepOnMobile] = useState(true);

  useEffect(() => {
    if (!sm) {
      setIsFirstStepOnMobile(true);
    }
  }, [sm]);

  useEffect(() => {
    resetTestTransactionsPool();
    setActiveWallet('');
    setWalletActivating(false);
    setAllTransactionsVisible(false);
  }, [isHelpModalClosed]);

  const handleMakeTx = () => {
    addTestTransaction(dayjs().unix());
  };

  return (
    <BasicModal
      withoutAnimationWhenOpen
      isOpen={isHelpWalletModalOpen}
      setIsOpen={setIsHelpWalletModalOpen}
      maxWidth={helpModalWidth}
      onBackButtonClick={
        !!activeWallet
          ? () => {
              setActiveWallet('');
              setWalletActivating(false);
            }
          : !isFirstStepOnMobile
          ? () => setIsFirstStepOnMobile(true)
          : () => {
              setIsHelpWalletModalOpen(false);
              infoType === InfoType.Vote
                ? setIsHelpVotingModalOpen(true)
                : setIsHelpNavigationModalOpen(true);
            }
      }
      withCloseButton>
      <HelpModalContainer
        onMainButtonClick={
          !!activeWallet
            ? () => {
                setActiveWallet('');
                setWalletActivating(false);
                setIsFirstStepOnMobile(!sm);
                setIsHelpWalletModalOpen(false);
                setIsHelpNavigationModalOpen(true);
              }
            : undefined
        }>
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
            {texts.faq.wallet.title}
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
            {texts.faq.wallet.transactionsViewDescription}
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
                    !activeWallet ? (
                      <WalletFirstImageDark />
                    ) : (
                      <WalletSecondImageDark />
                    )
                  ) : !activeWallet ? (
                    <WalletFirstImage />
                  ) : (
                    <WalletSecondImage />
                  )}
                </>
              </IconBox>
            </Box>

            <Box
              sx={{
                width: 360,
                mt: 20,
                [theme.breakpoints.up('md')]: {
                  mr: 20,
                  ml: 8,
                },
                [theme.breakpoints.up('lg')]: {
                  width: 450,
                  mr: 30,
                  ml: 10,
                },
              }}>
              <BoxWith3D
                alwaysWithBorders
                borderSize={8}
                contentColor="$mainLight"
                css={{
                  p: '40px 15px 20px',
                  [theme.breakpoints.up('lg')]: { p: '50px 35px 30px' },
                }}>
                {!activeWallet ? (
                  <ConnectWalletModalContent
                    walletActivating={walletActivating}
                    wallets={wallets}
                    onWalletButtonClick={() => {
                      setWalletActivating(true);
                      setTimeout(() => {
                        setActiveWallet(ethers.constants.AddressZero);
                        setWalletActivating(false);
                      }, 1000);
                    }}
                    withoutHelpText
                  />
                ) : (
                  <>
                    {allTransactionVisible ? (
                      <TransactionsModalContent
                        allTransactions={allTestTransaction}
                        onBackButtonClick={() =>
                          setAllTransactionsVisible(false)
                        }
                      />
                    ) : (
                      <AccountInfoModalContent
                        activeAddress={activeWallet}
                        ensName={activeWallet}
                        chainId={1}
                        isActive={true}
                        allTransactions={allTestTransaction}
                        onDelegateButtonClick={() => {
                          setActiveWallet('');
                          setWalletActivating(false);
                          setIsHelpWalletModalOpen(false);
                          setIsHelpDelegateModalOpen(true);
                        }}
                        onRepresentationsButtonClick={() => {
                          setActiveWallet('');
                          setWalletActivating(false);
                          setIsHelpWalletModalOpen(false);
                          setIsHelpRepresentationModalOpen(true);
                        }}
                        onDisconnectButtonClick={() => {
                          setActiveWallet('');
                          setWalletActivating(false);
                        }}
                        onAllTransactionButtonClick={() =>
                          setAllTransactionsVisible(true)
                        }
                        forTest
                      />
                    )}
                  </>
                )}
              </BoxWith3D>
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
              {texts.faq.wallet.title}
            </Box>
            {!activeWallet ? (
              <>
                <HelpModalText mb={12}>
                  {texts.faq.wallet.description}
                </HelpModalText>
                <Box
                  component="p"
                  sx={{
                    typography: 'body',
                    lineHeight: '20px !important',
                    fontWeight: 600,
                    [theme.breakpoints.up('lg')]: {
                      typography: 'body',
                      lineHeight: '24px !important',
                      fontWeight: 600,
                    },
                  }}>
                  {texts.faq.wallet.realWalletInfo}
                </Box>
              </>
            ) : (
              <>
                <Box
                  component="p"
                  sx={{
                    typography: 'body',
                    lineHeight: '20px !important',
                    display: 'none',
                    [theme.breakpoints.up('sm')]: {
                      typography: 'body',
                      display: 'inline-block',
                    },
                    [theme.breakpoints.up('lg')]: {
                      typography: 'body',
                      lineHeight: '24px !important',
                    },
                  }}>
                  {texts.faq.wallet.transactionsViewDescription}
                </Box>
                <Box sx={{ mt: 32 }}>
                  <BigButton
                    alwaysWithBorders
                    color="white"
                    onClick={handleMakeTx}>
                    {texts.faq.wallet.makeTransaction}
                  </BigButton>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </HelpModalContainer>
    </BasicModal>
  );
}
