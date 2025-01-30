import { Box, SxProps } from '@mui/system';
import dynamic from 'next/dynamic';
import numeral from 'numeral';
import React from 'react';

const CountUp = dynamic(() => import('react-countup'), { ssr: false });

interface CompactNumberProps {
  value: string | number;
  visibleDecimals?: number;
}

function CompactNumber({ value, visibleDecimals = 2 }: CompactNumberProps) {
  const visibleDecimalsLocal = String(0).padStart(visibleDecimals - 1, '0');
  return numeral(value).format(`0.[${visibleDecimalsLocal}]a`).toUpperCase();
}

interface CountUpProps {
  startValue: number;
  endValue: number;
  decimals: number;
}

function CountUpFormatted({ startValue, endValue, decimals }: CountUpProps) {
  return (
    <CountUp
      start={startValue}
      end={endValue}
      duration={0.7}
      separator=","
      decimals={decimals}
      decimal="."
    />
  );
}

function CompactCountUp({ startValue, endValue, decimals }: CountUpProps) {
  const visibleDecimalsLocal = String(0).padStart(
    (decimals < 4 ? 4 : decimals) - 1,
    '0',
  );

  const startValueLocal = numeral(startValue).format(
    `0.[${visibleDecimalsLocal}]a`,
  );
  const endValueLocal = numeral(endValue).format(
    `0.[${visibleDecimalsLocal}]a`,
  );

  const postfix = endValueLocal.substr(endValueLocal.length - 1, 1);

  return (
    <>
      <CountUpFormatted
        startValue={+startValueLocal.slice(0, -1)}
        endValue={+endValueLocal.slice(0, -1)}
        decimals={decimals}
      />
      {postfix.toUpperCase()}
    </>
  );
}

export interface FormattedNumberProps {
  value: string | number;
  visibleDecimals?: number;
  compact?: boolean;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'headline'
    | 'body'
    | 'descriptor'
    | 'descriptorAccent'
    | 'buttonLarge'
    | 'buttonMedium'
    | 'buttonSmall';
  css?: SxProps;
  countUp?: boolean;
  startValueForCountUp?: string | number;
}

export function FormattedNumber({
  value,
  visibleDecimals = 0,
  compact,
  variant,
  countUp,
  startValueForCountUp,
  css,
}: FormattedNumberProps) {
  const number = Number(value);

  const minValue = 10 ** -(visibleDecimals as number);
  const isSmallerThanMin =
    number !== 0 && Math.abs(number) < Math.abs(minValue);
  const formattedNumber = isSmallerThanMin ? minValue : number;

  const forceCompact = compact !== false && (compact || number > 99_999);

  const decimals = formattedNumber > 0 ? visibleDecimals : 0;

  const formattedStartValueForCountUp = startValueForCountUp
    ? isSmallerThanMin
      ? minValue
      : Number(startValueForCountUp)
    : 0;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        ...css,
      }}>
      <Box
        component="p"
        sx={{
          typography: variant,
          position: 'relative',
          whiteSpace: 'nowrap',
        }}>
        {!countUp ? (
          <>
            {!forceCompact ? (
              new Intl.NumberFormat('en-US', {
                maximumFractionDigits: decimals,
                minimumFractionDigits: decimals,
              }).format(formattedNumber)
            ) : (
              <CompactNumber
                value={formattedNumber}
                visibleDecimals={decimals}
              />
            )}
          </>
        ) : (
          <>
            {!forceCompact ? (
              <CountUpFormatted
                startValue={formattedStartValueForCountUp}
                endValue={formattedNumber}
                decimals={decimals}
              />
            ) : (
              <CompactCountUp
                startValue={formattedStartValueForCountUp}
                endValue={formattedNumber}
                decimals={decimals}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
