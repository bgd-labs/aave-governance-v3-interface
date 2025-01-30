import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

import { texts } from '../../helpers/texts/texts';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useStore } from '../../providers/ZustandStoreProvider';
import { media } from '../../styles/themeMUI';
import { TransactionsModalContent } from '../../transactions/components/TransactionsModalContent';
import { BasicModal } from '../BasicModal';
import { BigButton } from '../BigButton';
import { BoxWith3D } from '../BoxWith3D';
import { AccountInfoModalContent } from '../Web3/wallet/AccountInfoModalContent';
import { wallets } from '../Web3/wallet/ConnectWalletModal';
import { ConnectWalletModalContent } from '../Web3/wallet/ConnectWalletModalContent';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { InfoType } from './HelpModalNavigation';
import { HelpModalText } from './HelpModalText';

interface HelpWalletModalProps {
  infoType?: InfoType;
}

export function HelpWalletModal({ infoType }: HelpWalletModalProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const isHelpWalletModalOpen = useStore(
    (store) => store.isHelpWalletModalOpen,
  );
  const setIsHelpWalletModalOpen = useStore(
    (store) => store.setIsHelpWalletModalOpen,
  );
  const setIsHelpDelegateModalOpen = useStore(
    (store) => store.setIsHelpDelegateModalOpen,
  );
  const isHelpModalClosed = useStore((store) => store.isHelpModalClosed);
  const setIsHelpVotingModalOpen = useStore(
    (store) => store.setIsHelpVotingModalOpen,
  );
  const setIsHelpNavigationModalOpen = useStore(
    (store) => store.setIsHelpNavigationModalOpen,
  );
  const resetTestTransactionsPool = useStore(
    (store) => store.resetTestTransactionsPool,
  );
  const addTestTransaction = useStore((store) => store.addTestTransaction);
  const setIsHelpRepresentationModalOpen = useStore(
    (store) => store.setIsHelpRepresentationModalOpen,
  );
  const testTransactions = useStore((state) => state.testTransactionsPool);
  const allTestTransaction = Object.values(testTransactions).sort(
    (a, b) => b.localTimestamp - a.localTimestamp,
  );

  const [activeWallet, setActiveWallet] = useState('');
  const [walletActivating, setWalletActivating] = useState(false);
  const [allTransactionVisible, setAllTransactionsVisible] = useState(false);
  const [isFirstStepOnMobile, setIsFirstStepOnMobile] = useState(true);

  useEffect(() => {
    if (!sm) {
      setIsFirstStepOnMobile(true);
    } else {
      setIsFirstStepOnMobile(false);
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

  const TextBlock = () => {
    return (
      <>
        <Box
          component="h2"
          sx={{
            mb: 20,
            typography: 'h1',
            display: 'block',
          }}>
          {texts.faq.wallet.title}
        </Box>
        {!activeWallet ? (
          <>
            <HelpModalText mb={12}>
              {texts.faq.wallet.description}
            </HelpModalText>
            <Box component="p" sx={{ typography: 'headline' }}>
              {texts.faq.wallet.realWalletInfo}
            </Box>
          </>
        ) : (
          <Box
            component="p"
            sx={{
              typography: 'body',
              display: 'inline-block',
            }}>
            {texts.faq.wallet.transactionsViewDescription}
          </Box>
        )}
      </>
    );
  };

  return (
    <BasicModal
      isOpen={isHelpWalletModalOpen}
      setIsOpen={setIsHelpWalletModalOpen}
      maxWidth={helpModalWidth}
      onBackButtonClick={
        activeWallet
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
          !!activeWallet && !isFirstStepOnMobile
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
                    ? `url('/helpModals/wallet1_mobileDark.svg')`
                    : `url('/helpModals/wallet1_mobile.svg')`,
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
            css={{ mt: 24 }}>
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
              flexDirection: 'row',
            },
          }}>
          <Box
            sx={{
              mr: 18,
              display: 'flex',
              flexDirection: 'column-reverse',
              [theme.breakpoints.up('sm')]: {
                display: !activeWallet ? 'flex' : 'none',
                flexDirection: 'column',
              },
              [theme.breakpoints.up('md')]: {
                display: 'flex',
                flexDirection: 'column',
                mr: 0,
              },
            }}>
            <Box
              sx={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                left: 0,
                [theme.breakpoints.up('sm')]: {
                  display: 'flex',
                  width: 240,
                  height: 215,
                },
                [theme.breakpoints.up('md')]: {
                  width: 290,
                  height: 500,
                },
              }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage:
                    theme.palette.mode === 'dark' && !activeWallet
                      ? `url('/helpModals/wallet1_mobileDark.svg')`
                      : theme.palette.mode === 'dark' && activeWallet
                        ? `url('/helpModals/wallet2Dark.svg')`
                        : !activeWallet
                          ? `url('/helpModals/wallet1_mobile.svg')`
                          : `url('/helpModals/wallet2.svg')`,

                  [theme.breakpoints.up('md')]: {
                    backgroundImage:
                      theme.palette.mode === 'dark' && !activeWallet
                        ? `url('/helpModals/wallet1Dark.svg')`
                        : theme.palette.mode === 'dark' && activeWallet
                          ? `url('/helpModals/wallet2Dark.svg')`
                          : !activeWallet
                            ? `url('/helpModals/wallet1.svg')`
                            : `url('/helpModals/wallet2.svg')`,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                  display: 'block',
                  maxWidth: 240,
                },
                [theme.breakpoints.up('md')]: {
                  display: 'none',
                },
              }}>
              <TextBlock />
            </Box>
          </Box>

          <Box
            sx={{
              width: !activeWallet ? 360 : '100%',
              mt: 22,
              [theme.breakpoints.up('sm')]: {
                width: !activeWallet ? 360 : 657,
                mr: !activeWallet ? 20 : 0,
                ml: !activeWallet ? 8 : 12,
              },
              [theme.breakpoints.up('lg')]: {
                width: !activeWallet ? 450 : 759,
                mr: !activeWallet ? 30 : 0,
                ml: !activeWallet ? 10 : 12,
              },
            }}>
            {!!activeWallet && (
              <Box
                sx={{
                  mb: 22,
                  textAlign: 'center',
                  [theme.breakpoints.up('md')]: {
                    textAlign: 'left',
                  },
                  [theme.breakpoints.up('lg')]: {
                    mb: 30,
                  },
                }}>
                <TextBlock />
              </Box>
            )}

            <BoxWith3D
              alwaysWithBorders
              borderSize={8}
              contentColor="$mainLight"
              css={{
                p: 18,
                width: '100%',
                [theme.breakpoints.up('lg')]: { p: '24px 30px' },
              }}>
              {!activeWallet ? (
                <ConnectWalletModalContent
                  walletActivating={walletActivating}
                  wallets={wallets}
                  onWalletButtonClick={() => {
                    setWalletActivating(true);
                    setTimeout(() => {
                      setActiveWallet(zeroAddress);
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
                      onBackButtonClick={() => setAllTransactionsVisible(false)}
                      forTest
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

            {!!activeWallet && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 22,
                  [theme.breakpoints.up('md')]: {
                    justifyContent: 'flex-start',
                  },
                  [theme.breakpoints.up('lg')]: {
                    mt: 30,
                  },
                }}>
                <BigButton
                  alwaysWithBorders
                  color="white"
                  onClick={handleMakeTx}>
                  {texts.faq.wallet.makeTransaction}
                </BigButton>
              </Box>
            )}
          </Box>

          {!activeWallet && (
            <Box
              sx={{
                width: '100%',
                mt: 18,
                textAlign: 'center',
                order: 3,
                [theme.breakpoints.up('sm')]: {
                  display: 'none',
                },
                [theme.breakpoints.up('md')]: {
                  display: 'block',
                  width: 280,
                  order: 3,
                  textAlign: 'left',
                },
              }}>
              <TextBlock />
            </Box>
          )}
        </Box>
      </HelpModalContainer>
    </BasicModal>
  );
}
