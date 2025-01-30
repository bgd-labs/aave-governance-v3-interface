import { Box, useTheme } from '@mui/system';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import gelatoIcon from '../../assets/icons/gelato.svg?url';
import InfoIcon from '../../assets/icons/info.svg';
import { DECIMALS } from '../../configs/configs';
import { texts } from '../../helpers/texts/texts';
import {
  formatDataForDetails,
  getNextStateAndTimestampForActiveProposal,
  getProposalVotingData,
} from '../../requests/utils/formatProposalData';
import { ITutorialSlice } from '../../store/tutorialSlice';
import { ActionModalContent } from '../../transactions/components/ActionModalContent';
import { ProposalState, VotingDataByUser } from '../../types';
import { BigButton } from '../BigButton';
import { FormattedNumber } from '../FormattedNumber';
import { GelatoSwitcher } from '../GelatoSwitcher';
import { IconBox } from '../primitives/IconBox';
import { ProposalNextState } from '../ProposalNextState';
import { ToggleButton } from '../ToggleButton';
import { VoteBar } from '../VoteBar';
import { VotedState } from '../VotedState';
import { VotingModesContent } from '../VotingModesContent';
import { VotingTokensInfo } from '../VotingTokensInfo';
import { getTestTx } from './getTestTx';

interface HelpVoteTxProps extends Pick<ITutorialSlice, 'helpProposalData'> {
  support: boolean;
  setSupport: (value: boolean) => void;
  txPending: boolean;
  setTxPending: (value: boolean) => void;
  txSuccess: boolean;
  setTxSuccess: (value: boolean) => void;
  setIsVoteButtonClick: (value: boolean) => void;
}

export function HelpVoteTx({
  support,
  setSupport,
  txPending,
  setTxPending,
  txSuccess,
  setTxSuccess,
  setIsVoteButtonClick,
  helpProposalData,
}: HelpVoteTxProps) {
  const theme = useTheme();

  const [localVotingTokens, setLocalVotingTokens] = useState<
    VotingDataByUser[]
  >([]);
  const [isGaslessVote, setIsGaslessVote] = useState(true);
  const [isEditVotingTokensOpen, setEditVotingTokens] = useState(false);
  const [isVotingModesInfoOpen, setIsVotingModesInfoOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const [error, setError] = useState('');
  const [isTxStart, setIsTxStart] = useState(false);

  useEffect(() => {
    if (txPending) {
      setIsTxStart(true);
    }
  }, [txPending]);

  useEffect(() => {
    setSupport(false);
    setIsTxStart(false);
    setEditVotingTokens(false);
    setIsTxStart(false);
    setIsSwitching(true);
    setTimeout(() => setIsSwitching(false), 500);
  }, []);

  if (!helpProposalData) return null;

  const formattedData = formatDataForDetails({
    differential: helpProposalData.config.differential,
    coolDownBeforeVotingStart:
      helpProposalData.config.coolDownBeforeVotingStart,
    quorum: helpProposalData.config.quorum,
    precisionDivider: helpProposalData.constants.precisionDivider,
    expirationTime: helpProposalData.constants.expirationTime,
    cooldownPeriod: helpProposalData.constants.cooldownPeriod,
    core: helpProposalData.proposalData,
    payloads: helpProposalData.payloads,
    voting: helpProposalData.votingData,
    metadata: helpProposalData.metadata,
  });

  const localVotingPower =
    localVotingTokens.length > 0
      ? localVotingTokens
          .map((balance) => balance.votingPower)
          .reduce((sum, value) => sum + value, 0n)
      : helpProposalData.balances
          .map((balance) => balance.votingPower)
          .reduce((sum, value) => sum + value, 0n);

  const forVotes = !support
    ? helpProposalData.votingData.proposalData.forVotes + localVotingPower
    : helpProposalData.votingData.proposalData.forVotes;
  const againstVotes = support
    ? helpProposalData.votingData.proposalData.againstVotes + localVotingPower
    : helpProposalData.votingData.proposalData.againstVotes;

  const { requiredForVotes, requiredAgainstVotes, againstPercent, forPercent } =
    getProposalVotingData({
      forVotes,
      againstVotes,
      precisionDivider: helpProposalData.constants.precisionDivider,
      quorum: helpProposalData.config.quorum,
      differential: helpProposalData.config.differential,
    });

  const { state, timestamp } = getNextStateAndTimestampForActiveProposal({
    ...helpProposalData.constants,
    ...helpProposalData.config,
    core: helpProposalData.proposalData,
    payloads: helpProposalData.payloads,
    voting: helpProposalData.votingData,
    forVoteS: forVotes,
    againstVoteS: againstVotes,
  });

  return (
    <ActionModalContent
      setIsOpen={(value) => {
        setTxPending(value);
        setIsTxStart(value);
        setTxSuccess(value);
        setIsVoteButtonClick(value);
      }}
      error={error}
      setError={setError}
      isTxStart={isTxStart}
      setIsTxStart={setIsTxStart}
      contentMinHeight={isTxStart ? 287 : 211}
      closeButtonText={texts.faq.tx.tryAgain}
      tx={getTestTx({ txPending, txSuccess })}
      topBlock={
        !isVotingModesInfoOpen &&
        !isEditVotingTokensOpen && (
          <Box
            sx={{
              zIndex: 1,
            }}>
            <Box
              sx={{
                opacity: isTxStart ? 0 : 1,
                position: 'relative',
                zIndex: isTxStart ? -1 : 1,
              }}>
              <ToggleButton
                value={support}
                onToggle={(value: boolean) => {
                  setSupport(value);
                  setIsSwitching(true);
                  setTimeout(() => setIsSwitching(false), 500);
                }}
              />
            </Box>
            <Box
              sx={{
                textAlign: 'center',
                mt: isTxStart ? -62 : 32,
                position: 'relative',
                zIndex: 2,
                mb: 18,
                [theme.breakpoints.up('lg')]: {
                  mb: 24,
                },
              }}>
              <Box component="h2" sx={{ typography: 'h2' }}>
                {helpProposalData.metadata.title}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: 20,
                mb: isTxStart ? 0 : 18,
                [theme.breakpoints.up('lg')]: {
                  mb: isTxStart ? 0 : 24,
                },
              }}>
              {isTxStart ? (
                <VotedState support={!support} isBig />
              ) : (
                <ProposalNextState
                  proposalId={helpProposalData.proposalData.id}
                  state={state}
                  timestamp={timestamp}
                  isForHelpModal
                  isForModal
                />
              )}
            </Box>
          </Box>
        )
      }>
      {!isEditVotingTokensOpen && !isVotingModesInfoOpen && (
        <>
          <Box
            sx={{
              width: 300,
              mx: 'auto',
              mb: 18,
              [theme.breakpoints.up('lg')]: {
                mb: 24,
              },
            }}>
            <VoteBar
              type="for"
              value={formatUnits(forVotes, DECIMALS)}
              requiredValue={requiredForVotes}
              linePercent={forPercent}
              isValueBig={!support}
              isRequiredValueBig={support}
              withAnim={!txPending}
              startValueForCountUp={formatUnits(
                isSwitching
                  ? helpProposalData.votingData.proposalData.forVotes
                  : forVotes,
                DECIMALS,
              )}
              startRequiredValueForCountUp={formatUnits(
                isSwitching
                  ? parseUnits(
                      formattedData.requiredForVotes.toString(),
                      DECIMALS,
                    )
                  : parseUnits(requiredForVotes.toString(), DECIMALS),
                DECIMALS,
              )}
            />
            <VoteBar
              type="against"
              value={formatUnits(againstVotes, DECIMALS)}
              requiredValue={requiredAgainstVotes}
              linePercent={againstPercent}
              isRequiredValueBig={!support}
              isValueBig={support}
              withAnim={!txPending}
              startValueForCountUp={formatUnits(
                isSwitching
                  ? helpProposalData.votingData.proposalData.againstVotes
                  : againstVotes,
                DECIMALS,
              )}
              startRequiredValueForCountUp={formatUnits(
                isSwitching
                  ? parseUnits(
                      formattedData.requiredAgainstVotes.toString(),
                      DECIMALS,
                    )
                  : parseUnits(requiredAgainstVotes.toString(), DECIMALS),
                DECIMALS,
              )}
              isRequiredAgainstVisible={support}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              mb: 18,
              [theme.breakpoints.up('lg')]: {
                mb: 24,
              },
            }}>
            <Box
              component="p"
              sx={{ typography: 'body', mr: 2, display: 'inline-block' }}>
              {texts.proposals.yourVotingPower}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormattedNumber
                css={{
                  display: 'inline-block',
                  position: 'relative',
                  top: 0.5,
                }}
                variant="headline"
                value={+formatUnits(localVotingPower, DECIMALS)}
                visibleDecimals={2}
              />
              {helpProposalData.balances.length > 1 && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    setEditVotingTokens(true);
                    if (localVotingTokens.length <= 0) {
                      setLocalVotingTokens(helpProposalData.balances);
                    }
                  }}
                  sx={{
                    cursor: 'pointer',
                    width: 12,
                    height: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ml: 4,
                    hover: { opacity: '0.7' },
                  }}>
                  <IconBox
                    sx={(theme) => ({
                      width: 12,
                      height: 12,
                      '> svg': {
                        width: 12,
                        height: 12,
                        path: { fill: theme.palette.$textSecondary },
                      },
                    })}>
                    <InfoIcon />
                  </IconBox>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <BigButton
                alwaysWithBorders
                loading={txPending}
                activeColorType={support ? 'against' : 'for'}
                disabled={
                  localVotingPower <= 0 ||
                  formattedData.state.state > ProposalState.Voting
                }
                onClick={() => {
                  setTxPending(true);
                  setTimeout(() => {
                    setTxPending(false);
                    setTxSuccess(true);
                  }, 3000);
                }}
                css={{ '.BigButton__children': { height: '100%' } }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}>
                  {isGaslessVote && (
                    <IconBox
                      sx={(theme) => ({
                        width: 8,
                        height: 12,
                        mr: 5,
                        [theme.breakpoints.up('sm')]: {
                          width: 11,
                          height: 19,
                        },
                        '> img': {
                          width: 8,
                          height: 12,
                          [theme.breakpoints.up('sm')]: {
                            width: 11,
                            height: 19,
                          },
                        },
                      })}>
                      <Image src={gelatoIcon} alt="gelatoIcon" />
                    </IconBox>
                  )}
                  <Box
                    sx={{
                      height: '100%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {texts.proposals.vote}
                  </Box>
                </Box>
              </BigButton>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  mt: 18,
                  [theme.breakpoints.up('lg')]: {
                    mt: 24,
                  },
                }}>
                <GelatoSwitcher
                  value={isGaslessVote}
                  setValue={setIsGaslessVote}
                />

                <Box
                  onClick={() => setIsVotingModesInfoOpen(true)}
                  sx={(theme) => ({
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    mt: 6,
                    hover: {
                      '.VoteModal__gasLessText': {
                        color: theme.palette.$textSecondary,
                      },
                    },
                  })}>
                  <Box
                    className="VoteModal__gasLessText"
                    sx={{
                      typography: 'descriptor',
                      color: '$text',
                      transition: 'all 0.2s ease',
                    }}>
                    {texts.proposals.gasLess}
                  </Box>
                  <IconBox
                    sx={(theme) => ({
                      width: 10,
                      height: 10,
                      ml: 4,
                      '> svg': {
                        width: 10,
                        height: 10,
                        path: { fill: theme.palette.$textSecondary },
                      },
                    })}>
                    <InfoIcon />
                  </IconBox>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {!isEditVotingTokensOpen && isVotingModesInfoOpen && (
        <VotingModesContent onBackClick={setIsVotingModesInfoOpen} />
      )}
      {isEditVotingTokensOpen && !isVotingModesInfoOpen && (
        <VotingTokensInfo
          votingTokens={helpProposalData.balances}
          localVotingTokens={localVotingTokens}
          setVotingTokens={setLocalVotingTokens}
          setEditVotingTokens={setEditVotingTokens}
        />
      )}
    </ActionModalContent>
  );
}
