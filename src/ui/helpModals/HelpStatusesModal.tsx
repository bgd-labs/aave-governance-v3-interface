import { ProposalStateWithName } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import BackArrow from '/public/images/icons/arrowToLeft.svg';
import NextArrow from '/public/images/icons/arrowToRight.svg';

import { TimelineContent } from '../../proposals/components/timeline/TimelineContent';
import { useStore } from '../../store';
import { BigButton } from '../';
import { BasicModal } from '../components/BasicModal';
import { IconBox } from '../primitives/IconBox';
import { setRelativePath } from '../utils/relativePath';
import { texts } from '../utils/texts';
import { HelpModalCaption } from './HelpModalCaption';
import { HelpModalContainer, helpModalWidth } from './HelpModalContainer';
import { HelpModalHomeButton } from './HelpModalHomeButton';
import { InfoType } from './HelpModalNavigation';

type StatusInfo = {
  image: string;
  caption: string;
  statusInfoText: string;
  additionalText?: string;
  buttonText: string;
  backButtonText?: string;
  state: ProposalStateWithName;
  canceledTimestamp?: number;
  createdTimestamp: number;
  openToVoteTimestamp: number;
  votingClosedTimestamp: number;
  payloadsExecutedTimestamp: number;
  finishedTimestamp: number;
  imageXPosition?: number;
  imageYPosition?: number;
};

interface HelpStatusesModalProps {
  infoType?: InfoType;
}

export function HelpStatusesModal({ infoType }: HelpStatusesModalProps) {
  const theme = useTheme();

  const initialStatusInfo: StatusInfo = {
    image: 'statusInitial',
    caption: texts.faq.lifeCycles.initial.title,
    statusInfoText: texts.faq.lifeCycles.initial.description,
    buttonText: texts.faq.lifeCycles.initial.nextButtonTitle,
    backButtonText: texts.faq.lifeCycles.initial.prevButtonTitle,
    state: ProposalStateWithName.Created,
    canceledTimestamp: undefined,
    createdTimestamp: dayjs().unix(),
    openToVoteTimestamp: dayjs().unix() + 60 * 2,
    votingClosedTimestamp: dayjs().unix() + 60 * 4,
    payloadsExecutedTimestamp: dayjs().unix() + 60 * 8,
    finishedTimestamp: dayjs().unix() + 60 * 8,
  };

  const {
    isHelpStatusesModalOpen,
    setIsHelpStatusesModalOpen,
    setIsHelpNavigationModalOpen,
    setIsHelpVotingModalOpen,
  } = useStore();

  const [now, setNow] = useState(dayjs().unix());
  const [currentStep, setCurrentStep] = useState(0);
  const [statusInfo, setStatusInfo] = useState<StatusInfo>(initialStatusInfo);

  const resetToDefault = () => {
    setStatusInfo(initialStatusInfo);
    setCurrentStep(0);
    setNow(dayjs().unix());
  };

  useEffect(() => {
    resetToDefault();
  }, [isHelpStatusesModalOpen]);

  useEffect(() => {
    switch (currentStep) {
      case 1:
        setStatusInfo({
          image: 'statusCreated',
          caption: texts.faq.lifeCycles.created.title,
          statusInfoText: texts.faq.lifeCycles.created.description,
          buttonText: texts.faq.lifeCycles.created.nextButtonTitle,
          backButtonText: texts.faq.lifeCycles.created.prevButtonTitle,
          state: ProposalStateWithName.Created,
          canceledTimestamp: undefined,
          createdTimestamp: dayjs().unix(),
          openToVoteTimestamp: dayjs().unix() + 60 * 2,
          votingClosedTimestamp: dayjs().unix() + 60 * 4,
          payloadsExecutedTimestamp: dayjs().unix() + 60 * 8,
          finishedTimestamp: dayjs().unix() + 60 * 8,
        });
        break;
      case 2:
        setStatusInfo({
          image: 'statusOpenToVote',
          caption: texts.faq.lifeCycles.openToVote.title,
          statusInfoText: texts.faq.lifeCycles.openToVote.description,
          additionalText: texts.faq.lifeCycles.openToVote.additionDescription,
          buttonText: texts.faq.lifeCycles.openToVote.nextButtonTitle,
          backButtonText: texts.faq.lifeCycles.openToVote.prevButtonTitle,
          state: ProposalStateWithName.Active,
          createdTimestamp: now - 60 * 2,
          openToVoteTimestamp: now,
          votingClosedTimestamp: initialStatusInfo.votingClosedTimestamp,
          payloadsExecutedTimestamp:
            initialStatusInfo.payloadsExecutedTimestamp,
          finishedTimestamp: initialStatusInfo.finishedTimestamp,
        });
        break;
      case 3:
        setStatusInfo({
          image: 'statusVotingClosed',
          caption: texts.faq.lifeCycles.votingClosed.title,
          statusInfoText: texts.faq.lifeCycles.votingClosed.description,
          buttonText: texts.faq.lifeCycles.votingClosed.nextButtonTitle,
          backButtonText: texts.faq.lifeCycles.votingClosed.prevButtonTitle,
          state: ProposalStateWithName.Succeed,
          createdTimestamp: now - 60 * 4,
          openToVoteTimestamp: now - 60 * 2,
          votingClosedTimestamp: now,
          payloadsExecutedTimestamp:
            initialStatusInfo.payloadsExecutedTimestamp,
          finishedTimestamp: initialStatusInfo.finishedTimestamp,
        });
        break;
      case 4:
        setStatusInfo({
          image: 'statusProposalExecuted',
          caption: texts.faq.lifeCycles.proposalExecuted.title,
          statusInfoText: texts.faq.lifeCycles.proposalExecuted.description,
          additionalText:
            texts.faq.lifeCycles.proposalExecuted.additionDescription,
          buttonText: texts.faq.lifeCycles.proposalExecuted.nextButtonTitle,
          backButtonText: texts.faq.lifeCycles.proposalExecuted.prevButtonTitle,
          state: ProposalStateWithName.Succeed,
          createdTimestamp: now - 60 * 8,
          openToVoteTimestamp: now - 60 * 4,
          votingClosedTimestamp: now - 60 * 2,
          payloadsExecutedTimestamp: now,
          finishedTimestamp: initialStatusInfo.finishedTimestamp,
        });
        break;
      case 5:
        setStatusInfo({
          image: 'statusFinishedExecuted',
          caption: texts.faq.lifeCycles.finishedExecuted.title,
          statusInfoText: texts.faq.lifeCycles.finishedExecuted.description,
          buttonText: texts.faq.lifeCycles.finishedExecuted.nextButtonTitle,
          backButtonText: texts.faq.lifeCycles.finishedExecuted.prevButtonTitle,
          state: ProposalStateWithName.Executed,
          createdTimestamp: now - 60 * 8,
          openToVoteTimestamp: now - 60 * 4,
          votingClosedTimestamp: now - 60 * 2,
          payloadsExecutedTimestamp: now,
          finishedTimestamp: now,
        });
        break;
      case 6:
        setStatusInfo({
          image: 'statusFinishedFailed',
          caption: texts.faq.lifeCycles.finishedFailed.title,
          statusInfoText: texts.faq.lifeCycles.finishedFailed.description,
          buttonText: texts.faq.lifeCycles.finishedFailed.nextButtonTitle,
          backButtonText: texts.faq.lifeCycles.finishedFailed.prevButtonTitle,
          state: ProposalStateWithName.Failed,
          createdTimestamp: now - 60 * 8,
          openToVoteTimestamp: now - 60 * 4,
          votingClosedTimestamp: now - 60 * 2,
          payloadsExecutedTimestamp: now,
          finishedTimestamp: now,
        });
        break;
      case 7:
        setStatusInfo({
          image: 'statusFinishedCanceled',
          caption: texts.faq.lifeCycles.finishedCanceled.title,
          statusInfoText: texts.faq.lifeCycles.finishedCanceled.description,
          buttonText: '',
          backButtonText: texts.faq.lifeCycles.finishedCanceled.prevButtonTitle,
          state: ProposalStateWithName.Canceled,
          createdTimestamp: now - 60 * 8,
          openToVoteTimestamp: now - 60 * 4,
          votingClosedTimestamp: now - 60 * 2,
          payloadsExecutedTimestamp: now,
          finishedTimestamp: now,
          canceledTimestamp: now - 20,
        });
        break;
      default:
        resetToDefault();
        break;
    }
  }, [currentStep]);

  const isFinished =
    statusInfo.state === ProposalStateWithName.Executed ||
    statusInfo.state === ProposalStateWithName.Failed ||
    statusInfo.state === ProposalStateWithName.Canceled ||
    statusInfo.state === ProposalStateWithName.Expired;

  const handleNextClick = () => {
    if (currentStep > 6) {
      resetToDefault();
    }
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackClick = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <BasicModal
      maxWidth={helpModalWidth}
      isOpen={isHelpStatusesModalOpen}
      setIsOpen={setIsHelpStatusesModalOpen}
      onBackButtonClick={() => {
        setIsHelpStatusesModalOpen(false);
        infoType === InfoType.Vote
          ? setIsHelpVotingModalOpen(true)
          : setIsHelpNavigationModalOpen(true);
      }}
      withCloseButton>
      <HelpModalContainer>
        <HelpModalCaption
          withoutMargin={currentStep === 0}
          caption={statusInfo.caption}
          image={
            <Box
              sx={{
                width: 220,
                height: 200,
                background:
                  theme.palette.mode === 'dark'
                    ? `url(${setRelativePath(
                        `/images/helpModals/${statusInfo.image}Dark.svg`,
                      )})`
                    : `url(${setRelativePath(
                        `/images/helpModals/${statusInfo.image}.svg`,
                      )})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                [theme.breakpoints.up('lg')]: {
                  width: 290,
                  height: 270,
                  transform: `translate(${statusInfo.imageXPosition || 0}px, ${
                    statusInfo.imageYPosition || 0
                  }px)`,
                },
              }}
            />
          }>
          <Box
            sx={{
              maxWidth: 460,
              [theme.breakpoints.up('sm')]: { minHeight: 180 },
            }}>
            <Box sx={{ typography: 'body', lineHeight: '24px !important' }}>
              {statusInfo.statusInfoText}
              {statusInfo.additionalText && (
                <Box
                  component="p"
                  sx={{
                    typography: 'body',
                    mt: 12,
                    display: 'block',
                    lineHeight: '24px !important',
                  }}>
                  {statusInfo.additionalText}
                </Box>
              )}
            </Box>

            {currentStep === 0 && (
              <Box sx={{ mt: 32 }}>
                <BigButton alwaysWithBorders onClick={handleNextClick}>
                  {statusInfo.buttonText}
                </BigButton>
              </Box>
            )}
          </Box>
        </HelpModalCaption>

        {currentStep > 0 && (
          <Box sx={{ mt: 32 }}>
            <TimelineContent
              withoutDetails
              expiredTimestamp={
                statusInfo.createdTimestamp + statusInfo.finishedTimestamp
              }
              createdTimestamp={statusInfo.createdTimestamp}
              openToVoteTimestamp={statusInfo.openToVoteTimestamp}
              votingStartTime={statusInfo.openToVoteTimestamp}
              votingClosedTimestamp={statusInfo.votingClosedTimestamp}
              finishedTimestamp={statusInfo.finishedTimestamp}
              failedTimestamp={
                statusInfo.state === ProposalStateWithName.Failed
                  ? statusInfo.votingClosedTimestamp
                  : undefined
              }
              canceledTimestamp={statusInfo.canceledTimestamp}
              isFinished={isFinished}
              state={statusInfo.state}
            />
          </Box>
        )}

        {currentStep > 0 && (
          <Box
            sx={{
              display: 'flex',
              mt: 32,
              alignItems: 'center',
              justifyContent: currentStep > 0 ? 'space-between' : 'flex-end',
              minHeight: 35,
            }}>
            <BigButton
              alwaysWithBorders
              color="white"
              onClick={handleBackClick}
              disabled={currentStep === 0}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <IconBox
                  sx={{
                    mr: 5,
                    zIndex: 2,
                    width: 14,
                    height: 14,
                    '> svg': {
                      width: 14,
                      height: 14,
                    },
                    path: {
                      transition: 'all 0.2s ease',
                      stroke: theme.palette.$text,
                    },
                  }}>
                  <BackArrow />
                </IconBox>
                {statusInfo.backButtonText}
              </Box>
            </BigButton>

            {currentStep === 7 ? (
              <Box
                onClick={() => {
                  setIsHelpStatusesModalOpen(false);
                  setIsHelpNavigationModalOpen(true);
                }}>
                <HelpModalHomeButton />
              </Box>
            ) : (
              <BigButton alwaysWithBorders onClick={handleNextClick}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {statusInfo.buttonText}
                  <IconBox
                    sx={{
                      ml: 5,
                      zIndex: 2,
                      width: 14,
                      height: 14,
                      '> svg': {
                        width: 14,
                        height: 14,
                      },
                      path: {
                        transition: 'all 0.2s ease',
                        stroke: theme.palette.$textWhite,
                      },
                    }}>
                    <NextArrow />
                  </IconBox>
                </Box>
              </BigButton>
            )}
          </Box>
        )}
      </HelpModalContainer>
    </BasicModal>
  );
}
