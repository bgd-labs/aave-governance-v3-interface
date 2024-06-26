import { Box, useTheme } from '@mui/system';
import React from 'react';

import InfoIcon from '/public/images/icons/info.svg';

import { checkIsVotingAvailable } from '../../../representations/store/representationsSelectors';
import { useStore } from '../../../store/ZustandStoreProvider';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { IconBox } from '../../../ui/primitives/IconBox';
import { disablePageLoader } from '../../../ui/utils/disablePageLoader';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { RepresentationIcon } from '../RepresentationIcon';

interface VotingPowerProps {
  balanceLoading: boolean;
  isVoted: boolean;
  votingPower: number;
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

  const representative = useStore((store) => store.representative);
  const setIsRepresentationInfoModalOpen = useStore(
    (store) => store.setIsRepresentationInfoModalOpen,
  );
  const disabled = !useStore((store) =>
    checkIsVotingAvailable(store.representative, votingChainId),
  );

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
              setIsRepresentationInfoModalOpen(true);
              disablePageLoader();
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {!isForHelpModal && (
            <RepresentationIcon
              address={representative.address}
              disabled={disabled}
            />
          )}
          <FormattedNumber
            variant="h2"
            css={{
              color: disabled && !isForHelpModal ? '$textDisabled' : '$text',
            }}
            value={votingPower}
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
