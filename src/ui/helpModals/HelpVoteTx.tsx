import {
  Balance,
  formatProposal,
  getEstimatedState,
  ProposalState,
  ProposalWithLoadings,
  valueToBigNumber,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import InfoIcon from '/public/images/icons/info.svg';

import { EditVotingTokensContent } from '../../proposals/components/EditVotingTokensContent';
import { ProposalEstimatedStatus } from '../../proposals/components/ProposalEstimatedStatus';
import { VoteBar } from '../../proposals/components/VoteBar';
import { VotedState } from '../../proposals/components/VotedState';
import { useStore } from '../../store';
import { ActionModalContent } from '../../transactions/components/ActionModalContent';
import { BigButton } from '../components/BigButton';
import { FormattedNumber } from '../components/FormattedNumber';
import { ToggleButton } from '../components/ToggleButton';
import { IconBox } from '../primitives/IconBox';
import { texts } from '../utils/texts';

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
  const { setHelpProposalData } = useStore();

  const [localVotingTokens, setLocalVotingTokens] = useState<Balance[]>([]);
  const [isEditVotingTokensOpen, setEditVotingTokens] = useState(false);

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
    forVotesWithVotingPower === 0 ? 0 : forVotesWithVotingPower;

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
      txHash={ethers.constants.AddressZero}
      setIsOpen={(value) => {
        setTxPending(value);
        setIsTxStart(value);
        setTxSuccess(value);
        setIsVoteButtonClick(value);
      }}
      isError={false}
      error={error}
      setError={setError}
      isTxStart={isTxStart}
      setIsTxStart={setIsTxStart}
      txSuccess={txSuccess}
      txPending={txPending}
      contentMinHeight={isTxStart ? 287 : 211}
      closeButtonText={texts.faq.tx.tryAgain}
      topBlock={
        <Box
          sx={{
            zIndex: isEditVotingTokensOpen ? -1 : 1,
            opacity: isEditVotingTokensOpen ? 0 : 1,
            visibility: isEditVotingTokensOpen ? 'hidden' : 'visible',
          }}>
          <Box
            sx={{
              opacity: isTxStart ? 0 : 1,
              position: 'relative',
              zIndex: isTxStart ? -1 : 1,
            }}>
            <ToggleButton value={support} onToggle={setSupport} />
          </Box>
          <Box
            sx={{
              textAlign: 'center',
              mt: isTxStart ? -62 : 32,
              mb: 16,
              position: 'relative',
              zIndex: 2,
            }}>
            <Box component="h2" sx={{ typography: 'h2' }}>
              {proposalData.proposal.data.title}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mb: isTxStart ? 0 : 28,
              justifyContent: 'center',
              minHeight: 20,
            }}>
            {isTxStart ? (
              <VotedState support={!support} isBig inProcess={txPending} />
            ) : (
              <ProposalEstimatedStatus
                proposalId={proposalData.proposal.data.id}
                estimatedStatus={estimatedState}
                timestamp={timestampForEstimatedState}
                isForHelpModal
              />
            )}
          </Box>
        </Box>
      }>
      {!isEditVotingTokensOpen ? (
        <>
          <Box sx={{ width: 296, m: '0 auto 40px' }}>
            <VoteBar
              type="for"
              value={forVotesWithVotingPower}
              requiredValue={requiredForVotesAfterVote}
              linePercent={forPercentAfterVote}
              isValueBig={!support}
              isRequiredValueBig={support}
              withAnim={!txPending}
              startValueForCountUp={forVotes}
              startRequiredValueForCountUp={requiredForVotes}
            />
            <VoteBar
              type="against"
              value={againstVotesWithVotingPower}
              requiredValue={requiredAgainstVotesAfterVote}
              linePercent={againstPercentAfterVote}
              isRequiredValueBig={!support}
              isValueBig={support}
              withAnim={!txPending}
              startValueForCountUp={againstVotes}
              startRequiredValueForCountUp={requiredAgainstVotes}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              mb: 32,
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
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ml: 5,
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
                setHelpProposalData({
                  ...proposalData,
                  proposal: {
                    ...proposalData.proposal,
                    data: {
                      ...proposalData.proposal.data,
                      votingMachineData: {
                        ...proposalData.proposal.data.votingMachineData,
                        forVotes: support
                          ? '0'
                          : (localVotingPowerBasic / 10).toString(),
                        againstVotes: !support
                          ? '0'
                          : (localVotingPowerBasic / 10).toString(),
                        votedInfo: {
                          ...proposalData.proposal.data.votingMachineData
                            .votedInfo,
                          support: !support,
                          votingPower: (localVotingPowerBasic / 10).toString(),
                        },
                      },
                    },
                  },
                });
                setTimeout(() => {
                  setTxPending(false);
                  setTxSuccess(true);
                }, 3000);
              }}>
              {texts.proposals.vote}
            </BigButton>
          </Box>
        </>
      ) : (
        <EditVotingTokensContent
          votingTokens={votingTokens}
          localVotingTokens={localVotingTokens}
          setVotingTokens={setLocalVotingTokens}
          setEditVotingTokens={setEditVotingTokens}
        />
      )}
    </ActionModalContent>
  );
}
