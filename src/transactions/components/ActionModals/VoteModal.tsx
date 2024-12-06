import { Box, useTheme } from '@mui/system';
import {
  getSafeSingletonDeployment,
  SingletonDeployment,
} from '@safe-global/safe-deployments';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { formatUnits, parseUnits, zeroAddress, zeroHash } from 'viem';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import gelatoIcon from '../../../assets/icons/gelato.svg?url';
import InfoIcon from '../../../assets/icons/info.svg';
import { BigButton } from '../../../components/BigButton';
import { FormattedNumber } from '../../../components/FormattedNumber';
import { GelatoSwitcher } from '../../../components/GelatoSwitcher';
import { IconBox } from '../../../components/primitives/IconBox';
import { ProposalNextState } from '../../../components/ProposalNextState';
import { RepresentationIcon } from '../../../components/RepresentationIcon';
import { ToggleButton } from '../../../components/ToggleButton';
import { Tooltip } from '../../../components/Tooltip';
import { VoteBar } from '../../../components/VoteBar';
import { VotedState } from '../../../components/VotedState';
import { VotingModesContent } from '../../../components/VotingModesContent';
import { VotingTokensInfo } from '../../../components/VotingTokensInfo';
import { DECIMALS } from '../../../configs/configs';
import { texts } from '../../../helpers/texts/texts';
import { useStore } from '../../../providers/ZustandStoreProvider';
import {
  getNextStateAndTimestampForActiveProposal,
  getProposalVotingData,
} from '../../../requests/utils/formatProposalData';
import {
  selectProposalDataByUser,
  selectProposalDetailedData,
} from '../../../store/selectors/proposalsSelector';
import { checkIsVotingAvailable } from '../../../store/selectors/representationsSelectors';
import { TxType } from '../../../store/transactionsSlice';
import { ProposalState, VotingDataByUser } from '../../../types';
import { useLastTxLocalStatus } from '../../useLastTxLocalStatus';
import { BasicActionModal } from '../BasicActionModal';
import { ActionModalBasicTypes } from './types';

export function VoteModal({
  isOpen,
  setIsOpen,
  proposalId,
  fromList,
}: ActionModalBasicTypes) {
  const theme = useTheme();

  const configs = useStore((store) => store.configs);
  const activeWallet = useStore((store) => store.activeWallet);
  const vote = useStore((store) => store.vote);
  const supportObject = useStore((store) => store.supportObject);
  const setSupportObject = useStore((store) => store.setSupportObject);
  const checkIsGelatoAvailableWithApiKey = useStore(
    (store) => store.checkIsGelatoAvailableWithApiKey,
  );
  const votingBalances = useStore((store) => store.votingBalances);
  const votedData = useStore((store) => store.votedData);
  const representative = useStore((store) => store.representative);
  const clearSupportObject = useStore((store) => store.clearSupportObject);
  const isGelatoAvailableChains = useStore(
    (store) => store.isGelatoAvailableChains,
  );
  const isGaslessVote = useStore((store) => store.isGaslessVote);
  const setIsGaslessVote = useStore((store) => store.setIsGaslessVote);
  const checkIsGaslessVote = useStore((store) => store.checkIsGaslessVote);
  const proposalDetails = useStore((store) => store.proposalDetails);
  const getProposalDetails = useStore((store) => store.getProposalDetails);
  const startActiveProposalDetailsPolling = useStore(
    (store) => store.startActiveProposalDetailsPolling,
  );
  const stopActiveProposalDetailsPolling = useStore(
    (store) => store.stopActiveProposalDetailsPolling,
  );
  const setIsRepresentationInfoModalOpen = useStore(
    (store) => store.setIsRepresentationInfoModalOpen,
  );

  const [localVotingTokens, setLocalVotingTokens] = useState<
    VotingDataByUser[]
  >([]);
  const [isEditVotingTokensOpen, setEditVotingTokens] = useState(false);
  const [isVotingModesInfoOpen, setIsVotingModesInfoOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [votingPower, setVotingPower] = useState(0n);

  useEffect(() => {
    if (!proposalDetails[proposalId]) {
      getProposalDetails(proposalId);
    }
  }, [proposalId]);

  const data = selectProposalDetailedData({ proposalDetails, id: proposalId });
  const userProposalData = selectProposalDataByUser({
    votingBalances,
    snapshotBlockHash: data?.proposalData.snapshotBlockHash ?? zeroHash,
    walletAddress:
      representative?.address || activeWallet?.address || zeroAddress,
    votedData,
  });

  useEffect(() => {
    if (userProposalData.voted) {
      if (userProposalData.voted.isVoted) {
        setVotingPower(userProposalData.voted.votedInfo.votedPower);
      } else {
        if (userProposalData.voting) {
          setVotingPower(userProposalData.votingPower);
        }
      }
    }
  }, [
    userProposalData.voted,
    userProposalData.voting,
    activeWallet,
    representative.address,
  ]);

  useEffect(() => {
    if (data) {
      if (!data.formattedData.isFinished) {
        checkIsGelatoAvailableWithApiKey(data.votingData.votingChainId);
      }
    }
  }, [data?.proposalData.id]);

  useEffect(() => {
    if (data) {
      if (!data.formattedData.isFinished) {
        checkIsGaslessVote(data.votingData.votingChainId);
      }
    }
  }, [data?.proposalData.id, isGelatoAvailableChains]);

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
      if (fromList) {
        startActiveProposalDetailsPolling(proposalId);
      }
    }
    () => stopActiveProposalDetailsPolling();
  }, [tx?.pending, tx?.isError]);

  if (!data || !configs) return null;

  const localVotingPower =
    localVotingTokens.length > 0
      ? localVotingTokens
          .map((balance) => balance.votingPower)
          .reduce((sum, value) => sum + value, 0n)
      : votingPower;

  const forVotes = !support
    ? data.votingData.proposalData.forVotes + localVotingPower
    : data.votingData.proposalData.forVotes;
  const againstVotes = support
    ? data.votingData.proposalData.againstVotes + localVotingPower
    : data.votingData.proposalData.againstVotes;

  const { requiredForVotes, requiredAgainstVotes, againstPercent, forPercent } =
    getProposalVotingData({
      forVotes,
      againstVotes,
      precisionDivider: configs.contractsConstants.precisionDivider,
      quorum: configs.configs[0].quorum,
      differential: configs.configs[0].differential,
    });

  const { state, timestamp } = getNextStateAndTimestampForActiveProposal({
    ...configs.contractsConstants,
    ...configs.configs.filter(
      (config) => config.accessLevel === data.proposalData.accessLevel,
    )[0],
    core: data.proposalData,
    payloads: data.payloadsData,
    voting: data.votingData,
    forVoteS: forVotes,
    againstVoteS: againstVotes,
  });

  const handleVote = async (gelato?: boolean) => {
    stopActiveProposalDetailsPolling();
    return await executeTxWithLocalStatuses({
      callbackFunction: async () =>
        await vote({
          votingChainId: data.votingData.votingChainId,
          proposalId: data.proposalData.id,
          snapshotBlockHash: data.proposalData.snapshotBlockHash,
          support: !support,
          gelato,
          balances:
            localVotingTokens.length > 0
              ? localVotingTokens
              : userProposalData.voting,
          voterAddress: representative.address,
        }),
    });
  };

  let safeSingletonContract: SingletonDeployment | undefined = undefined;
  if (activeWallet?.isContractAddress) {
    safeSingletonContract = getSafeSingletonDeployment({
      network: data.votingData.votingChainId.toString(),
    });
  }

  const disabled = !checkIsVotingAvailable(
    representative,
    data.votingData.votingChainId,
  );

  const isGelatoAvailable =
    isGelatoAvailableChains[data.votingData.votingChainId];

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
                {data.metadata.title}
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
                <ProposalNextState
                  proposalId={proposalId}
                  state={state}
                  timestamp={timestamp}
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
              withAnim={!loading}
              startValueForCountUp={formatUnits(
                isSwitching ? data.votingData.proposalData.forVotes : forVotes,
                DECIMALS,
              )}
              startRequiredValueForCountUp={formatUnits(
                isSwitching
                  ? parseUnits(
                      data.formattedData.requiredForVotes.toString(),
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
              withAnim={!loading}
              startValueForCountUp={formatUnits(
                isSwitching
                  ? data.votingData.proposalData.againstVotes
                  : againstVotes,
                DECIMALS,
              )}
              startRequiredValueForCountUp={formatUnits(
                isSwitching
                  ? parseUnits(
                      data.formattedData.requiredAgainstVotes.toString(),
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
              sx={{ typography: 'body', mr: 4, display: 'inline-block' }}>
              {texts.proposals.yourVotingPower}
            </Box>

            <Box
              onClick={() => {
                if (disabled) {
                  setIsRepresentationInfoModalOpen(true);
                }
              }}
              sx={{ display: 'flex', alignItems: 'center' }}>
              <RepresentationIcon
                address={representative.address}
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
                value={formatUnits(localVotingPower, DECIMALS)}
                visibleDecimals={2}
              />
              {(userProposalData?.voting ?? []).length > 1 && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    if (!disabled) {
                      setEditVotingTokens(true);
                      if (localVotingTokens.length <= 0) {
                        setLocalVotingTokens(userProposalData.voting);
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
                    data.formattedData.state.state > ProposalState.Voting ||
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
        <VotingTokensInfo
          votingTokens={userProposalData.voting}
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
