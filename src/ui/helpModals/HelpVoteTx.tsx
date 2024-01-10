import {
  Balance,
  formatProposal,
  getEstimatedState,
  ProposalState,
  ProposalWithLoadings,
  valueToBigNumber,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import { BigNumber } from 'bignumber.js';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

// @ts-ignore
import gelatoIcon from '/public/images/icons/gelato.svg?url';
import InfoIcon from '/public/images/icons/info.svg';

import { EditVotingTokensContent } from '../../proposals/components/EditVotingTokensContent';
import { ProposalEstimatedStatus } from '../../proposals/components/ProposalEstimatedStatus';
import { VoteBar } from '../../proposals/components/VoteBar';
import { VotedState } from '../../proposals/components/VotedState';
import { VotingModesContent } from '../../proposals/components/VotingModesContent';
import { ActionModalContent } from '../../transactions/components/ActionModalContent';
import { BigButton } from '../components/BigButton';
import { FormattedNumber } from '../components/FormattedNumber';
import { GelatoSwitcher } from '../components/GelatoSwitcher';
import { ToggleButton } from '../components/ToggleButton';
import { IconBox } from '../primitives/IconBox';
import { texts } from '../utils/texts';
import { getTestTx } from './getTestTx';

interface HelpVoteTxProps {
  support: boolean;
  setSupport: (value: boolean) => void;
  txPending: boolean;
  setTxPending: (value: boolean) => void;
  txSuccess: boolean;
  setTxSuccess: (value: boolean) => void;
  setIsVoteButtonClick: (value: boolean) => void;
  proposalData: ProposalWithLoadings;
}

export function HelpVoteTx({
  support,
  setSupport,
  txPending,
  setTxPending,
  txSuccess,
  setTxSuccess,
  setIsVoteButtonClick,
  proposalData,
}: HelpVoteTxProps) {
  const theme = useTheme();

  const [localVotingTokens, setLocalVotingTokens] = useState<Balance[]>([]);
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

  const {
    votingPowerBasic,
    votingPower,
    forVotes,
    againstVotes,
    requiredDiff,
    minQuorumVotes,
    requiredAgainstVotes,
    requiredForVotes,
    votingTokens,
  } = formatProposal(proposalData.proposal);

  const localVotingPowerBasic =
    localVotingTokens.length > 0
      ? localVotingTokens
          .map((balance) =>
            valueToBigNumber(balance.basicValue).div(10).toNumber(),
          )
          .reduce((sum, value) => sum + value, 0)
      : votingPowerBasic;
  const localVotingPower =
    localVotingTokens.length > 0
      ? localVotingTokens
          .map((balance) => valueToBigNumber(balance.value).toNumber())
          .reduce((sum, value) => sum + value, 0)
      : votingPower;

  const forVotesWithVotingPowerBasic = !support
    ? valueToBigNumber(proposalData.proposal.data.votingMachineData.forVotes)
        .plus(localVotingPowerBasic)
        .toString()
    : proposalData.proposal.data.votingMachineData.forVotes;
  const againstVotesWithVotingPowerBasic = support
    ? valueToBigNumber(
        proposalData.proposal.data.votingMachineData.againstVotes,
      )
        .plus(localVotingPowerBasic)
        .toString()
    : proposalData.proposal.data.votingMachineData.againstVotes;

  const forVotesWithVotingPower = !support
    ? forVotes + localVotingPower
    : forVotes;
  const againstVotesWithVotingPower = support
    ? againstVotes + localVotingPower
    : againstVotes;

  const requiredForVotesAfterVote =
    againstVotesWithVotingPower + requiredDiff < minQuorumVotes
      ? minQuorumVotes
      : againstVotesWithVotingPower + requiredDiff;
  const requiredAgainstVotesAfterVote =
    forVotesWithVotingPower === 0 ||
    forVotesWithVotingPower - requiredDiff <= 0 ||
    forVotesWithVotingPower < minQuorumVotes
      ? minQuorumVotes
      : forVotesWithVotingPower - requiredDiff;

  const forPercentAfterVote = new BigNumber(forVotesWithVotingPower)
    .dividedBy(requiredForVotesAfterVote)
    .multipliedBy(100)
    .toNumber();
  const againstPercentAfterVote = new BigNumber(againstVotesWithVotingPower)
    .dividedBy(
      requiredAgainstVotesAfterVote > 0 ? requiredAgainstVotesAfterVote : 1,
    )
    .multipliedBy(100)
    .toNumber();

  const { estimatedState, timestampForEstimatedState } = getEstimatedState(
    proposalData.proposal,
    forVotesWithVotingPowerBasic,
    againstVotesWithVotingPowerBasic,
  );

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
                {proposalData.proposal.data.title}
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
                <ProposalEstimatedStatus
                  proposalId={proposalData.proposal.data.id}
                  estimatedStatus={estimatedState}
                  timestamp={timestampForEstimatedState}
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
              value={forVotesWithVotingPower}
              requiredValue={requiredForVotesAfterVote}
              linePercent={forPercentAfterVote}
              isValueBig={!support}
              isRequiredValueBig={support}
              withAnim={!txPending}
              startValueForCountUp={
                isSwitching ? forVotes : forVotesWithVotingPower
              }
              startRequiredValueForCountUp={
                isSwitching ? requiredForVotes : requiredForVotesAfterVote
              }
            />
            <VoteBar
              type="against"
              value={againstVotesWithVotingPower}
              requiredValue={requiredAgainstVotesAfterVote}
              linePercent={againstPercentAfterVote}
              isRequiredValueBig={!support}
              isValueBig={support}
              withAnim={!txPending}
              startValueForCountUp={
                isSwitching ? againstVotes : againstVotesWithVotingPower
              }
              startRequiredValueForCountUp={
                isSwitching
                  ? requiredAgainstVotes
                  : requiredAgainstVotesAfterVote
              }
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
                value={localVotingPower}
                visibleDecimals={2}
              />
              {votingTokens.length > 1 && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    setEditVotingTokens(true);
                    if (localVotingTokens.length <= 0) {
                      setLocalVotingTokens(votingTokens);
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
                  proposalData.proposal.state > ProposalState.Active
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
        <EditVotingTokensContent
          votingTokens={votingTokens}
          localVotingTokens={localVotingTokens}
          setVotingTokens={setLocalVotingTokens}
          setEditVotingTokens={setEditVotingTokens}
          forTest
        />
      )}
    </ActionModalContent>
  );
}
