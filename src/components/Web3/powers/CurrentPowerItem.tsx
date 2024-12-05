import { Box, useTheme } from '@mui/system';

import { GovernancePowerType } from '../../../types';
import { FormattedNumber } from '../../FormattedNumber';
import { CustomSkeleton } from '../../primitives/CustomSkeleton';
import { RepresentationIcon } from '../../RepresentationIcon';

interface CurrentPowerItemProps {
  type: GovernancePowerType;
  totalValue?: number;
  yourValue?: number;
  delegatedValue?: number;
  representativeAddress?: string;
}

export function CurrentPowerItem({
  type,
  totalValue,
  yourValue,
  delegatedValue,
  representativeAddress,
}: CurrentPowerItemProps) {
  const theme = useTheme();

  const isVotingType = type === GovernancePowerType.VOTING;

  return (
    <Box
      sx={{
        minWidth: 230,
        mb: 22,
        [theme.breakpoints.up('sm')]: { mb: 0, mr: 44 },
        '&:last-of-type': { mb: '0 !important', mr: '0 !important' },
      }}>
      <Box
        sx={{
          typography: 'headline',
          display: 'flex',
          alignItems: 'flex-end',
          mb: 6,
        }}>
        Total {isVotingType ? 'Voting' : 'Proposition'} power:{' '}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 3 }}>
          {!!representativeAddress && isVotingType && (
            <RepresentationIcon
              address={representativeAddress}
              disabled={false}
            />
          )}
          {!!totalValue || totalValue === 0 ? (
            <FormattedNumber
              value={totalValue}
              variant="headline"
              visibleDecimals={2}
            />
          ) : (
            <CustomSkeleton width={60} height={14} />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          typography: 'descriptor',
          display: 'flex',
          alignItems: 'flex-end',
          mb: 6,
        }}>
        Power from balance:{' '}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 3 }}>
          {!!representativeAddress && isVotingType && (
            <RepresentationIcon
              address={representativeAddress}
              disabled={false}
            />
          )}
          {!!yourValue || yourValue === 0 ? (
            <FormattedNumber
              value={yourValue}
              variant="descriptor"
              visibleDecimals={2}
            />
          ) : (
            <CustomSkeleton width={40} height={10} />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          typography: 'descriptor',
          display: 'flex',
          alignItems: 'flex-end',
        }}>
        Delegation received:{' '}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 3 }}>
          {!!representativeAddress && isVotingType && (
            <RepresentationIcon
              address={representativeAddress}
              disabled={false}
            />
          )}
          {!!delegatedValue || delegatedValue === 0 ? (
            <FormattedNumber
              value={delegatedValue}
              variant="descriptor"
              visibleDecimals={2}
            />
          ) : (
            <CustomSkeleton width={40} height={10} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
