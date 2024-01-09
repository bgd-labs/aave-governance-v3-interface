import { Box, useTheme } from '@mui/system';

import { FormattedNumber } from '../../ui/components/FormattedNumber';
import { texts } from '../../ui/utils/texts';
import { VoteLine } from './VoteLine';

interface VoteBarProps {
  type: 'for' | 'against';
  value: number | string;
  requiredValue: number | string;
  linePercent: number;
  isFinished?: boolean;
  isValueBig?: boolean;
  isRequiredValueBig?: boolean;
  withAnim?: boolean;
  startValueForCountUp?: number | string;
  startRequiredValueForCountUp?: number | string;
  isRequiredAgainstVisible?: boolean;
}

export function VoteBar({
  type,
  value,
  requiredValue,
  linePercent,
  isFinished,
  isValueBig,
  isRequiredValueBig,
  withAnim,
  startValueForCountUp,
  startRequiredValueForCountUp,
  isRequiredAgainstVisible,
}: VoteBarProps) {
  const theme = useTheme();

  const NumberWithValue = ({
    text,
    number,
    isNumberBig,
    startNumber,
  }: {
    text: string;
    number: number | string;
    isNumberBig?: boolean;
    startNumber?: number | string;
  }) => {
    return (
      <Box
        sx={{
          typography: 'body',
          lineHeight: '1 !important',
          color: '$text',
          display: 'inline-flex',
        }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'flex-end',
            height: 19,
            [theme.breakpoints.up('lg')]: {
              height: 21,
            },
          }}>
          {text}
        </Box>
        <FormattedNumber
          variant={isNumberBig ? 'h2' : 'headline'}
          css={{
            display: 'inline-flex',
            alignItems: 'flex-end',
            color: '$text',
            transition: 'all 0.5s ease',
            position: 'relative',
            ml: 6,
            height: 19,
            [theme.breakpoints.up('lg')]: {
              height: 21,
            },
            '> p': {
              fontWeight: 600,
              lineHeight: '1 !important',
            },
          }}
          value={number}
          visibleDecimals={2}
          countUp={withAnim && isNumberBig}
          startValueForCountUp={startNumber}
          compact
        />
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        mb: 4,
        '&:last-of-type': { mb: 0 },
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: 19,
          [theme.breakpoints.up('lg')]: {
            height: 21,
          },
        }}>
        <NumberWithValue
          text={
            type === 'for' ? texts.other.toggleFor : texts.other.toggleAgainst
          }
          number={value}
          isNumberBig={isValueBig}
          startNumber={startValueForCountUp}
        />

        {!isFinished && (type !== 'against' || isRequiredAgainstVisible) && (
          <NumberWithValue
            text={texts.other.required}
            number={requiredValue}
            isNumberBig={isRequiredValueBig}
            startNumber={startRequiredValueForCountUp}
          />
        )}
      </Box>
      <VoteLine percent={linePercent} width="100%" color={type} />
    </Box>
  );
}
