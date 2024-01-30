import {
  Balance,
  CombineProposalState,
  formatProposal,
  getEstimatedState,
  valueToBigNumber,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import {
  getSafeSingletonDeployment,
  SingletonDeployment,
} from '@safe-global/safe-deployments';
import { BigNumber } from 'bignumber.js';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

// @ts-ignore
import gelatoIcon from '/public/images/icons/gelato.svg?url';
import InfoIcon from '/public/images/icons/info.svg';

import { checkIsVotingAvailable } from '../../../representations/store/representationsSelectors';
import { useStore } from '../../../store';
import { BasicActionModal } from '../../../transactions/components/BasicActionModal';
import { useLastTxLocalStatus } from '../../../transactions/hooks/useLastTxLocalStatus';
import { TxType } from '../../../transactions/store/transactionsSlice';
import { BigButton, ToggleButton, Tooltip } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { GelatoSwitcher } from '../../../ui/components/GelatoSwitcher';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import { getProposalDataById } from '../../store/proposalsSelectors';
import { EditVotingTokensContent } from '../EditVotingTokensContent';
import { ProposalEstimatedStatus } from '../ProposalEstimatedStatus';
import { RepresentationIcon } from '../RepresentationIcon';
import { VoteBar } from '../VoteBar';
import { VotedState } from '../VotedState';
import { VotingModesContent } from '../VotingModesContent';
import { ActionModalBasicTypes } from './types';

export function VoteModal({
  isOpen,
  setIsOpen,
  proposalId,
  fromList,
}: ActionModalBasicTypes) {
  const store = useStore();
  const theme = useTheme();
  const {
    vote,
    supportObject,
    setSupportObject,
    activeWallet,
    checkIsGelatoAvailableWithApiKey,
    representative,
    clearSupportObject,
    isGelatoAvailableChains,
    isGaslessVote,
    setIsGaslessVote,
    checkIsGaslessVote,
  } = store;

  const [localVotingTokens, setLocalVotingTokens] = useState<Balance[]>([]);
  const [isEditVotingTokensOpen, setEditVotingTokens] = useState(false);
  const [isVotingModesInfoOpen, setIsVotingModesInfoOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const proposalData = useStore((store) =>
    getProposalDataById(store, proposalId),
  );

  useEffect(() => {
    if (proposalData) {
      const isFinished =
        proposalData.proposal.combineState === CombineProposalState.Executed ||
        proposalData.proposal.combineState === CombineProposalState.Failed ||
        proposalData.proposal.combineState === CombineProposalState.Canceled ||
        proposalData.proposal.combineState === CombineProposalState.Expired;

      if (!isFinished) {
        checkIsGelatoAvailableWithApiKey(
          proposalData.proposal.data.votingChainId,
        );
      }
    }
  }, [proposalData?.loading]);

  useEffect(() => {
    if (proposalData) {
      const isFinished =
        proposalData.proposal.combineState === CombineProposalState.Executed ||
        proposalData.proposal.combineState === CombineProposalState.Failed ||
        proposalData.proposal.combineState === CombineProposalState.Canceled ||
        proposalData.proposal.combineState === CombineProposalState.Expired;

      if (!isFinished) {
        checkIsGaslessVote(proposalData.proposal.data.votingChainId);
      }
    }
  }, [proposalData?.loading, isGelatoAvailableChains]);

  useEffect(() => {
    clearSupportObject(proposalId);
    if (!Object.keys(supportObject).find((key) => +key === proposalId)) {
      setSupportObject(proposalId, false);
    }
    setEditVotingTokens(false);
    setIsVotingModesInfoOpen(false);
    setLocalVotingTokens([]);
    setIsSwitching(true);
    setTimeout(() => setIsSwitching(false), 500);
  }, [isOpen]);

  const support = supportObject[proposalId];
  const setSupport = (value: boolean) => {
    setSupportObject(proposalId, value);
    setIsSwitching(true);
    setTimeout(() => setIsSwitching(false), 500);
  };

  const {
    error,
    setError,
    loading,
    isTxStart,
    setIsTxStart,
    executeTxWithLocalStatuses,
    fullTxErrorMessage,
    setFullTxErrorMessage,
    tx,
  } = useLastTxLocalStatus({
    type: TxType.vote,
    payload: {
      proposalId,
      support: !support,
      voter: representative.address || activeWallet?.address || zeroAddress,
    },
  });

  useEffect(() => {
    if (tx?.pending === false || tx?.isError) {
      store.startDetailedProposalDataPolling(
        fromList ? undefined : [proposalId],
      );
    }
  }, [tx?.pending, tx?.isError]);

  if (!proposalData?.proposal) return null;

  const proposal = proposalData.proposal;

  const {
    minQuorumVotes,
    againstVotes,
    requiredDiff,
    forVotes,
    requiredForVotes,
    requiredAgainstVotes,
    votingPower,
    votingPowerBasic,
    votingTokens,
  } = formatProposal(proposal);

  const localVotingPowerBasic =
    localVotingTokens.length > 0
      ? localVotingTokens
          .map((balance) => valueToBigNumber(balance.basicValue).toNumber())
          .reduce((sum, value) => sum + value, 0)
      : votingPowerBasic;
  const localVotingPower =
    localVotingTokens.length > 0
      ? localVotingTokens
          .map((balance) => valueToBigNumber(balance.value).toNumber())
          .reduce((sum, value) => sum + value, 0)
      : votingPower;

  const forVotesWithVotingPowerBasic = !support
    ? valueToBigNumber(proposal.data.votingMachineData.forVotes)
        .plus(localVotingPowerBasic)
        .toString()
    : proposal.data.votingMachineData.forVotes;
  const againstVotesWithVotingPowerBasic = support
    ? valueToBigNumber(proposal.data.votingMachineData.againstVotes)
        .plus(localVotingPowerBasic)
        .toString()
    : proposal.data.votingMachineData.againstVotes;

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
    proposal,
    forVotesWithVotingPowerBasic,
    againstVotesWithVotingPowerBasic,
  );

  const handleVote = async (gelato?: boolean) => {
    store.stopDetailedProposalDataPolling();
    return await executeTxWithLocalStatuses({
      callbackFunction: async () =>
        await vote({
          votingChainId: proposal.data.votingChainId,
          proposalId: proposal.data.id,
          support: !support,
          gelato,
          balances:
            localVotingTokens.length > 0 ? localVotingTokens : votingTokens,
          voterAddress: representative.address,
        }),
    });
  };

  let safeSingletonContract: SingletonDeployment | undefined = undefined;
  if (activeWallet?.isContractAddress) {
    safeSingletonContract = getSafeSingletonDeployment({
      network: proposal.data.votingChainId.toString(),
    });
  }

  const disabled = !checkIsVotingAvailable(
    store,
    proposalData.proposal.data.votingChainId,
  );

  const isGelatoAvailable =
    isGelatoAvailableChains[proposalData.proposal.data.votingChainId];

  return (
    <BasicActionModal
      withMinHeight
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isTxStart={isTxStart}
      setIsTxStart={setIsTxStart}
      error={error}
      setError={setError}
      contentMinHeight={isTxStart ? 287 : 211}
      fullTxErrorMessage={fullTxErrorMessage}
      setFullTxErrorMessage={setFullTxErrorMessage}
      contentCss={{ pt: 12 }}
      tx={tx}
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
              <ToggleButton value={support} onToggle={setSupport} />
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
                {proposal.data.title}
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
                <VotedState support={!support} isBig inProcess={tx.isError} />
              ) : (
                <ProposalEstimatedStatus
                  proposalId={proposalId}
                  estimatedStatus={estimatedState}
                  timestamp={timestampForEstimatedState}
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
              withAnim={!loading}
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
              withAnim={!loading}
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
              sx={{ typography: 'body', mr: 4, display: 'inline-block' }}>
              {texts.proposals.yourVotingPower}
            </Box>

            <Box
              onClick={() => {
                if (disabled) {
                  store.setIsRepresentationInfoModalOpen(true);
                }
              }}
              sx={{ display: 'flex', alignItems: 'center' }}>
              <RepresentationIcon
                address={store.representative.address}
                disabled={disabled}
              />
              <FormattedNumber
                css={{
                  display: 'inline-block',
                  position: 'relative',
                  top: 0.5,
                  color: disabled ? '$textDisabled' : '$text',
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
                    if (!disabled) {
                      setEditVotingTokens(true);
                      if (localVotingTokens.length <= 0) {
                        setLocalVotingTokens(votingTokens);
                      }
                    }
                  }}
                  sx={{
                    cursor: 'pointer',
                    width: 12,
                    height: 12,
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
            {activeWallet?.isContractAddress &&
            !safeSingletonContract?.defaultAddress ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Box
                  sx={{
                    typography: 'body',
                    color: '$textSecondary',
                  }}>
                  {texts.other.votingNotAvailableForGnosis}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <BigButton
                  alwaysWithBorders
                  loading={loading}
                  disabled={
                    loading ||
                    proposal.combineState > CombineProposalState.Active ||
                    localVotingPower <= 0
                  }
                  activeColorType={support ? 'against' : 'for'}
                  onClick={() => handleVote(isGaslessVote)}
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
                        sx={{
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
                        }}>
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
                  <Tooltip
                    color="light"
                    tooltipCss={{
                      minWidth: 320,
                      display:
                        activeWallet?.isContractAddress || !isGelatoAvailable
                          ? 'inline-flex'
                          : 'none',
                    }}
                    tooltipContent={
                      <Box
                        sx={{
                          typography: 'descriptor',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          p: 5,
                          display: 'inline-flex',
                        }}>
                        {activeWallet?.isContractAddress
                          ? texts.proposals.gelatoNotAvailableGnosis
                          : texts.proposals.gelatoNotAvailableChain}
                      </Box>
                    }>
                    <GelatoSwitcher
                      value={isGaslessVote}
                      setValue={setIsGaslessVote}
                      disabled={
                        activeWallet?.isContractAddress || !isGelatoAvailable
                      }
                    />
                  </Tooltip>

                  <Box
                    onClick={() => setIsVotingModesInfoOpen(true)}
                    sx={(theme) => ({
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      mt: 8,
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
            )}
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
          representativeAddress={representative.address}
          isRepresentativeVoteDisabled={disabled}
        />
      )}
    </BasicActionModal>
  );
}
