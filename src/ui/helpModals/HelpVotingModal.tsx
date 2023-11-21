import { Box, useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';

import ProposalTxStartImage from '/public/images/helpModals/proposalTxStart.svg';
import ProposalTxStartImageDark from '/public/images/helpModals/proposalTxStartDark.svg';
import ProposalTxVotedAgainstImage from '/public/images/helpModals/proposalTxVotedAgainst.svg';
import ProposalTxVotedAgainstImageDark from '/public/images/helpModals/proposalTxVotedAgainstDark.svg';
import ProposalTxVotedForImage from '/public/images/helpModals/proposalTxVotedFor.svg';
import ProposalTxVotedForImageDark from '/public/images/helpModals/proposalTxVotedForDark.svg';
import ArrowToRight from '/public/images/icons/arrowToRightW.svg';

import { ActiveProposalListItem } from '../../proposals/components/proposalList/ActiveProposalListItem';
import { useStore } from '../../store';
import { BigButton } from '../';
import { BasicModal } from '../components/BasicModal';
import { IconBox } from '../primitives/IconBox';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useMediaQuery } from '../utils/useMediaQuery';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalText } from './HelpModalText';
import { HelpModalTextButton } from './HelpModalTextButton';
import { HelpModalTooltip } from './HelpModalTooltip';
import { HelpTxWrapper } from './HelpTxWrapper';
import { HelpVoteTx } from './HelpVoteTx';

export function HelpVotingModal() {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const [support, setSupport] = useState(false);
  const [isVoteButtonClick, setIsVoteButtonClick] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [isFirstStepOnMobile, setIsFirstStepOnMobile] = useState(true);
  const [isFirstStepOnTxMobile, setIsFirstStepOnTxMobile] = useState(true);

  const {
    isHelpModalClosed,
    setIsHelpNavigationModalOpen,
    isHelpVotingModalOpen,
    setIsHelpVotingModalOpen,
    setIsHelpWalletModalOpen,
    setIsHelpStatusesModalOpen,
    setIsHelpVotingPowerModalOpen,
    setIsHelpVotingBarsModalOpen,
    helpProposalData,
    getHelpProposalData,
  } = useStore();

  useEffect(() => {
    getHelpProposalData();
    setIsVoteButtonClick(false);
    setTxPending(false);
    setTxSuccess(false);
  }, [isHelpModalClosed]);

  useEffect(() => {
    if (!sm) {
      setIsFirstStepOnMobile(true);
      setIsFirstStepOnTxMobile(true);
    }
  }, [sm]);

  if (!helpProposalData) return null;

  return (
    <BasicModal
      withoutAnimationWhenOpen
      maxWidth={helpModalWidth}
      isOpen={isHelpVotingModalOpen}
      setIsOpen={setIsHelpVotingModalOpen}
      onBackButtonClick={
        !isFirstStepOnTxMobile
          ? () => {
              getHelpProposalData();
              setIsFirstStepOnTxMobile(true);
              setTxPending(false);
              setTxSuccess(false);
            }
          : isVoteButtonClick
            ? () => {
                setIsVoteButtonClick(false);
                setTxSuccess(false);
              }
            : !isFirstStepOnMobile
              ? () => setIsFirstStepOnMobile(true)
              : () => {
                  setIsHelpVotingModalOpen(false);
                  setIsHelpNavigationModalOpen(true);
                }
      }
      withCloseButton>
      <HelpModalContainer
        onMainButtonClick={
          txSuccess && !txPending
            ? () => {
                setIsVoteButtonClick(false);
                setTxSuccess(false);
                setIsHelpVotingModalOpen(false);
                setIsHelpNavigationModalOpen(true);
              }
            : undefined
        }>
        {!isVoteButtonClick ? (
          <>
            <Box
              sx={{
                display: !isFirstStepOnMobile ? 'none' : 'block',
                [theme.breakpoints.up('sm')]: { display: 'block' },
              }}>
              <HelpModalCaption
                caption={texts.faq.voting.title}
                image={
                  <Box
                    sx={{
                      width: 220,
                      height: 200,
                      background:
                        theme.palette.mode === 'dark'
                          ? `url(${setRelativePath(
                              '/images/helpModals/proposalMainDark.svg',
                            )})`
                          : `url(${setRelativePath(
                              '/images/helpModals/proposalMain.svg',
                            )})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      [theme.breakpoints.up('sm')]: { width: 290, height: 270 },
                    }}
                  />
                }>
                <Box sx={{ maxWidth: 460 }}>
                  <HelpModalText mb={12}>
                    {texts.faq.voting.firstDescriptionFirstPart}{' '}
                    <HelpModalTextButton
                      onClick={() => {
                        setIsHelpVotingModalOpen(false);
                        setIsHelpWalletModalOpen(true);
                      }}>
                      <>{texts.faq.voting.connectWallet}</>
                    </HelpModalTextButton>{' '}
                    {texts.faq.voting.firstDescriptionSecondPart}
                  </HelpModalText>
                  <Box
                    component="p"
                    sx={{
                      typography: 'body',
                      lineHeight: '20px !important',
                      display: 'none',
                      [theme.breakpoints.up('sm')]: {
                        typography: 'body',
                        lineHeight: '20px !important',
                        display: 'block',
                      },
                      [theme.breakpoints.up('lg')]: {
                        typography: 'body',
                        lineHeight: '24px !important',
                      },
                    }}>
                    {texts.faq.voting.secondDescription}
                  </Box>
                </Box>
              </HelpModalCaption>

              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  [theme.breakpoints.up('sm')]: {
                    display: 'none',
                  },
                }}>
                <BigButton
                  alwaysWithBorders
                  onClick={() => setIsFirstStepOnMobile(false)}
                  css={{ mt: 10 }}>
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
            </Box>

            <Box
              sx={{
                display: 'none',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                mb: -10,
                px: 20,
                [theme.breakpoints.up('md')]: { display: 'flex' },
                [theme.breakpoints.up('lg')]: {
                  px: 35,
                  mb: -20,
                },
              }}>
              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                <HelpModalTooltip maxWidth={316}>
                  <Box component="p" sx={{ typography: 'body' }}>
                    {texts.faq.voting.firstTooltip}
                  </Box>
                </HelpModalTooltip>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <HelpModalTooltip
                  maxWidth={250}
                  countNumber={2}
                  css={{ mr: -20, [theme.breakpoints.up('lg')]: { mr: 10 } }}>
                  <Box component="p" sx={{ typography: 'body' }}>
                    {texts.faq.voting.secondTooltipFirstPart}{' '}
                    <HelpModalTextButton
                      white
                      onClick={() => {
                        setIsHelpVotingModalOpen(false);
                        setIsHelpVotingPowerModalOpen(true);
                      }}>
                      <>{texts.faq.voting.votingPower}</>
                    </HelpModalTextButton>{' '}
                    {texts.faq.voting.secondTooltipSecondPart}
                  </Box>
                </HelpModalTooltip>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                <HelpModalTooltip
                  maxWidth={300}
                  countNumber={3}
                  position="right">
                  <Box component="p" sx={{ typography: 'body' }}>
                    {texts.faq.voting.thirdTooltipFirstPart}{' '}
                    <HelpModalTextButton
                      white
                      onClick={() => {
                        setIsHelpVotingModalOpen(false);
                        setIsHelpVotingBarsModalOpen(true);
                      }}>
                      <>{texts.faq.voting.votingProgress}</>
                    </HelpModalTextButton>{' '}
                    {texts.faq.voting.thirdTooltipSecondPart}
                  </Box>
                </HelpModalTooltip>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'relative',
                display: !isFirstStepOnMobile ? 'block' : 'none',
                [theme.breakpoints.up('sm')]: { display: 'block' },
              }}>
              <Box
                component="h2"
                sx={{
                  typography: 'h1',
                  mb: 24,
                  textAlign: 'center',
                  [theme.breakpoints.up('sm')]: {
                    typography: 'h1',
                    display: 'none',
                  },
                }}>
                {texts.faq.voting.proposalBar}
              </Box>

              <Box
                sx={{
                  position: 'relative',
                  pl: 15,
                  [theme.breakpoints.up('sm')]: { pl: 0 },
                }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: -5,
                    top: 40,
                    [theme.breakpoints.up('sm')]: {
                      left: 25,
                      top: -20,
                    },
                    [theme.breakpoints.up('md')]: {
                      display: 'none',
                    },
                  }}>
                  <HelpModalTooltip maxWidth={316} mobileBottomPadding={54}>
                    <Box component="p" sx={{ typography: 'body' }}>
                      {texts.faq.voting.firstTooltip}
                    </Box>
                  </HelpModalTooltip>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    left: -5,
                    bottom: 10,
                    [theme.breakpoints.up('sm')]: {
                      left: 25,
                      bottom: -10,
                    },
                    [theme.breakpoints.up('md')]: {
                      display: 'none',
                    },
                  }}>
                  <HelpModalTooltip
                    maxWidth={250}
                    mobileBottomPadding={50}
                    countNumber={sm ? 2 : 3}
                    css={{ mr: -20, [theme.breakpoints.up('lg')]: { mr: 10 } }}>
                    <Box component="p" sx={{ typography: 'body' }}>
                      {texts.faq.voting.secondTooltipFirstPart}{' '}
                      <HelpModalTextButton
                        white
                        onClick={() => {
                          setIsHelpVotingModalOpen(false);
                          setIsHelpVotingPowerModalOpen(true);
                        }}>
                        <>{texts.faq.voting.votingPower}</>
                      </HelpModalTextButton>{' '}
                      {texts.faq.voting.secondTooltipSecondPart}
                    </Box>
                  </HelpModalTooltip>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    left: -5,
                    top: 130,
                    [theme.breakpoints.up('sm')]: {
                      left: 'auto',
                      right: 15,
                      top: -20,
                    },
                    [theme.breakpoints.up('md')]: {
                      display: 'none',
                    },
                  }}>
                  <HelpModalTooltip
                    maxWidth={300}
                    mobileBottomPadding={80}
                    countNumber={sm ? 3 : 2}
                    position="right">
                    <Box component="p" sx={{ typography: 'body' }}>
                      {texts.faq.voting.thirdTooltipFirstPart}{' '}
                      <HelpModalTextButton
                        white
                        onClick={() => {
                          setIsHelpVotingModalOpen(false);
                          setIsHelpVotingBarsModalOpen(true);
                        }}>
                        <>{texts.faq.voting.votingProgress}</>
                      </HelpModalTextButton>{' '}
                      {texts.faq.voting.thirdTooltipSecondPart}
                    </Box>
                  </HelpModalTooltip>
                </Box>

                <ActiveProposalListItem
                  proposalData={helpProposalData}
                  voteButtonClick={() => setIsVoteButtonClick(true)}
                  isForHelpModal
                />
              </Box>

              <Box
                component="p"
                sx={{
                  typography: 'body',
                  lineHeight: '20px !important',
                  mt: 40,
                  textAlign: 'center',
                  [theme.breakpoints.up('sm')]: {
                    typography: 'body',
                    lineHeight: '20px !important',
                    display: 'none',
                  },
                  [theme.breakpoints.up('lg')]: {
                    typography: 'body',
                    lineHeight: '24px !important',
                  },
                }}>
                {texts.faq.voting.secondDescription}
                <br />
                <b>{texts.faq.voting.pressVoteButton}</b>
              </Box>
            </Box>
          </>
        ) : (
          <HelpTxWrapper
            mobileTitle={
              !txPending && txSuccess
                ? texts.faq.voting.txSuccess
                : txPending && !txSuccess
                  ? texts.faq.voting.txPending
                  : texts.faq.voting.txStart
            }
            withTxOnMobile={!isFirstStepOnTxMobile}
            txStartImage={
              theme.palette.mode === 'dark'
                ? ProposalTxStartImageDark
                : ProposalTxStartImage
            }
            txEndImage={
              support
                ? theme.palette.mode === 'dark'
                  ? ProposalTxVotedAgainstImageDark
                  : ProposalTxVotedAgainstImage
                : theme.palette.mode === 'dark'
                  ? ProposalTxVotedForImageDark
                  : ProposalTxVotedForImage
            }
            txStartImageMobile={
              theme.palette.mode === 'dark'
                ? 'images/helpModals/proposalTxStartMobileDark.svg'
                : 'images/helpModals/proposalTxStartMobile.svg'
            }
            txEndImageMobile={
              support
                ? theme.palette.mode === 'dark'
                  ? 'images/helpModals/proposalTxVotedAgainstDark.svg'
                  : 'images/helpModals/proposalTxVotedAgainst.svg'
                : theme.palette.mode === 'dark'
                  ? 'images/helpModals/proposalTxVotedForDark.svg'
                  : 'images/helpModals/proposalTxVotedFor.svg'
            }
            txPending={txPending}
            txSuccess={txSuccess}
            txBlock={
              <HelpVoteTx
                support={support}
                setSupport={setSupport}
                proposalData={helpProposalData}
                txPending={txPending}
                setTxPending={setTxPending}
                txSuccess={txSuccess}
                setTxSuccess={setTxSuccess}
                setIsVoteButtonClick={setIsVoteButtonClick}
              />
            }>
            <>
              <Box
                component="h2"
                sx={{
                  typography: 'h1',
                  mb: 20,
                  display: 'none',
                  [theme.breakpoints.up('sm')]: { display: 'block' },
                }}>
                {!txPending && txSuccess
                  ? texts.faq.voting.txSuccess
                  : txPending && !txSuccess
                    ? texts.faq.voting.txPending
                    : texts.faq.voting.txStart}
              </Box>
              {!txPending && !txSuccess && (
                <>
                  <Box
                    component="p"
                    sx={{
                      typography: 'body',
                      lineHeight: '20px !important',
                      mb: 12,
                      display: isFirstStepOnTxMobile ? 'block' : 'none',
                      [theme.breakpoints.up('sm')]: {
                        typography: 'body',
                        display: 'block',
                      },
                      [theme.breakpoints.up('lg')]: {
                        typography: 'body',
                        lineHeight: '24px !important',
                      },
                    }}>
                    {texts.faq.voting.txStartFirstDescription}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      typography: 'body',
                      lineHeight: '20px !important',
                      mb: 12,
                      display: isFirstStepOnTxMobile ? 'block' : 'none',
                      [theme.breakpoints.up('sm')]: {
                        typography: 'body',
                        display: 'block',
                      },
                      [theme.breakpoints.up('lg')]: {
                        typography: 'body',
                        lineHeight: '24px !important',
                      },
                    }}>
                    {texts.faq.voting.txStartSecondDescription}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      typography: 'body',
                      lineHeight: '20px !important',
                      display: isFirstStepOnTxMobile ? 'none' : 'block',
                      [theme.breakpoints.up('sm')]: {
                        typography: 'body',
                        display: 'block',
                      },
                      [theme.breakpoints.up('lg')]: {
                        typography: 'body',
                        lineHeight: '24px !important',
                      },
                    }}>
                    {texts.faq.voting.txStartThirdDescription}
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: isFirstStepOnTxMobile ? 'flex' : 'none',
                      [theme.breakpoints.up('sm')]: {
                        display: 'none',
                      },
                    }}>
                    <BigButton
                      alwaysWithBorders
                      onClick={() => setIsFirstStepOnTxMobile(false)}
                      css={{ mt: 10 }}>
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
                </>
              )}
              {txPending && !txSuccess && (
                <HelpModalText>
                  {texts.faq.voting.txPendingDescription}
                </HelpModalText>
              )}
              {!txPending && txSuccess && (
                <>
                  <HelpModalText mb={12}>
                    {texts.faq.voting.txSuccessFirstDescription}
                  </HelpModalText>
                  <HelpModalText>
                    {texts.faq.voting.txSuccessSecondDescription}{' '}
                    <HelpModalTextButton
                      onClick={() => {
                        setIsHelpVotingModalOpen(false);
                        setIsHelpStatusesModalOpen(true);
                      }}>
                      <>{texts.faq.voting.proposalLifeCycle}</>
                    </HelpModalTextButton>
                    .
                  </HelpModalText>
                </>
              )}
            </>
          </HelpTxWrapper>
        )}
      </HelpModalContainer>
    </BasicModal>
  );
}
