// TODO: temporary, use numeral instead

import {
  normalizeBN,
  valueToBigNumber,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box, SxProps } from '@mui/system';
import { BigNumber } from 'bignumber.js';
import dynamic from 'next/dynamic';
import React from 'react';

const CountUp = dynamic(() => import('react-countup'), { ssr: false });

interface CompactNumberProps {
  value: string | number;
  visibleDecimals?: number;
}

const POSTFIXES = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];

function getCompactValueEndPostfix(bnValue: BigNumber) {
  const integerPlaces = bnValue.toFixed(0).length;
  const significantDigitsGroup = Math.min(
    Math.floor(integerPlaces ? (integerPlaces - 1) / 3 : 0),
    POSTFIXES.length - 1,
  );
  const postfix = POSTFIXES[significantDigitsGroup];
  const formattedValue = normalizeBN(
    bnValue,
    3 * significantDigitsGroup,
  ).toNumber();

  return { postfix, formattedValue };
}

function CompactNumber({ value, visibleDecimals = 2 }: CompactNumberProps) {
  const bnValue = valueToBigNumber(value);

  const { postfix, formattedValue } = getCompactValueEndPostfix(bnValue);

  return (
    <>
      {new Intl.NumberFormat('en-US', {
        maximumFractionDigits: visibleDecimals,
        minimumFractionDigits: visibleDecimals,
      }).format(formattedValue)}
      {postfix}
    </>
  );
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
  const bnStartValue = valueToBigNumber(startValue);
  const bnEndValue = valueToBigNumber(endValue);

  const { formattedValue: formattedStartValue } =
    getCompactValueEndPostfix(bnStartValue);
  const { postfix, formattedValue: formattedEndValue } =
    getCompactValueEndPostfix(bnEndValue);

  return (
    <>
      <CountUpFormatted
        startValue={formattedStartValue}
        endValue={formattedEndValue}
        decimals={decimals}
      />
      {postfix}
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
