import { Box, useTheme } from '@mui/system';
import React from 'react';
import { formatUnits } from 'viem';

import InfoIcon from '../../assets/icons/info.svg';
import { DECIMALS } from '../../configs/configs';
import { texts } from '../../helpers/texts/texts';
import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { FormattedNumber } from '../FormattedNumber';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { IconBox } from '../primitives/IconBox';

interface VotingPowerProps {
  balanceLoading: boolean;
  isVoted: boolean;
  votingPower: bigint;
  votingChainId: number;
  isForHelpModal?: boolean;
}

export function VotingPower({
  balanceLoading,
  isVoted,
  votingPower,
  votingChainId,
  isForHelpModal,
}: VotingPowerProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  // const disabled = !useStore((store) =>
  //   checkIsVotingAvailable(store.representative, votingChainId),
  // );
  const disabled = false;

  return (
    <Box
      sx={{
        textAlign: 'left',
        minWidth: 145,
        display: 'flex',
        alignItems: 'flex-end',
        [theme.breakpoints.up('md')]: { textAlign: 'center', display: 'block' },
        '.VotingPowerLoading__value': {
          height: 19,
        },
      }}>
      <Box
        component="p"
        sx={{
          typography: 'body',
          color: '$textSecondary',
          mr: 6,
          [theme.breakpoints.up('md')]: { mb: 6, mr: 0 },
        }}>
        {texts.proposals.yourVotingPower}
      </Box>

      {balanceLoading && !isVoted ? (
        <CustomSkeleton width={60} height={19} />
      ) : (
        <Box
          onClick={(e) => {
            if (disabled && !isForHelpModal) {
              e.stopPropagation();
              e.preventDefault();
              // setIsRepresentationInfoModalOpen(true);
              // disablePageLoader();
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/*{!isForHelpModal && (*/}
          {/*  <RepresentationIcon*/}
          {/*    address={representative.address}*/}
          {/*    disabled={disabled}*/}
          {/*  />*/}
          {/*)}*/}
          <FormattedNumber
            variant="h2"
            css={{
              color: disabled && !isForHelpModal ? '$textDisabled' : '$text',
            }}
            value={+formatUnits(votingPower, DECIMALS)}
            visibleDecimals={2}
            compact={!sm}
          />
          {disabled && !isForHelpModal && (
            <IconBox
              sx={(theme) => ({
                width: 10,
                height: 10,
                cursor: 'pointer',
                ml: 4,
                hover: {
                  '> svg': {
                    path: { fill: theme.palette.$text },
                  },
                },
                '> svg': {
                  width: 10,
                  height: 10,
                  path: { fill: theme.palette.$textSecondary },
                },
              })}>
              <InfoIcon />
            </IconBox>
          )}
        </Box>
      )}
    </Box>
  );
}
