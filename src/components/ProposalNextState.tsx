import { Box, SxProps } from '@mui/system';
import React from 'react';

import InfoIcon from '../assets/icons/info.svg';
import { ProposalNextState as State } from '../types';
import { IconBox } from './primitives/IconBox';
import { Timer } from './Timer';
import { Tooltip } from './Tooltip';

interface ProposalEstimatedStatusProps {
  proposalId: number;
  state: State;
  timestamp: number;
  isSecondary?: boolean;
  css?: SxProps;
  isForModal?: boolean;
  isForHelpModal?: boolean;
}

export function ProposalNextState({
  proposalId,
  state,
  timestamp,
  isSecondary,
  css,
  isForModal,
  isForHelpModal,
}: ProposalEstimatedStatusProps) {
  const statusTextStringArray = state.split(' ');
  statusTextStringArray.splice(state === State.Voting ? -3 : -1);
  const statusText = statusTextStringArray.join(' ');
  const statusStringArray = state.split(' ');
  const status =
    state === State.Voting
      ? statusStringArray.splice(1).join(' ')
      : statusStringArray[statusStringArray.length - 1];

  return (
    <Box
      className="ProposalEstimatedStatus"
      sx={{ display: 'flex', whiteSpace: 'nowrap', ...css }}>
      <Box
        className="ProposalStatus"
        component="p"
        sx={{
          typography: 'headline',
          mr: 4,
          color:
            state === State.Failed
              ? isForModal
                ? '$mainAgainst'
                : '$text'
              : state === State.Succeed
                ? '$mainFor'
                : state === State.Expired
                  ? '$textDisabled'
                  : isSecondary
                    ? '$textSecondary'
                    : '$text',
        }}>
        <Box component="span" sx={{ typography: 'body', color: '$text' }}>
          {statusText}
        </Box>{' '}
        {isForModal ? status : status === 'fail' ? 'end' : status}
      </Box>

      <Box component="p" sx={{ typography: 'body', color: '$textSecondary' }}>
        in{' '}
        <Timer
          expiryTimestamp={timestamp}
          // onExpire={
          //   () =>
          //     !isForHelpModal &&
          //     getDetailedProposalsData({ ids: [proposalId], fullData: true }) // TODO update active proposals data
          // }
        />
      </Box>

      {state === State.PayloadsExecuted && (
        <Box
          sx={(theme) => ({
            mx: 4,
            cursor: 'help',
            display: 'none',
            [theme.breakpoints.up('md')]: {
              display: 'block',
            },
          })}>
          <Tooltip
            tooltipContent={
              <Box
                component="p"
                sx={{
                  p: 12,
                  backgroundColor: '$appBackground',
                  typography: 'descriptor',
                  wordBreak: 'break-word',
                  cursor: 'default',
                  whiteSpace: 'normal',
                  minWidth: 250,
                }}>
                When a proposal has multiple payloads across different networks,
                the execution time of each payload will be slightly different,
                as bridging time varies depending on the destination network and
                underlying bridge providers.
                <br />
                <br />
                <span>
                  The time on when a <b>payloads will start executing</b> refers
                  to when the <b>first</b> network payload will be enacted.
                </span>
              </Box>
            }>
            <IconBox
              sx={(theme) => ({
                position: 'relative',
                top: 1,
                width: 14,
                height: 14,
                '> svg': {
                  width: 14,
                  height: 14,
                  path: {
                    fill: theme.palette.$text,
                  },
                },
              })}>
              <InfoIcon />
            </IconBox>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
