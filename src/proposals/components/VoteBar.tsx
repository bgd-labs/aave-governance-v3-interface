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
}: VoteBarProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        mb: 4,
        [theme.breakpoints.up('lg')]: { mb: 5 },
        '&:last-of-type': { mb: 0 },
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: 19,
          mb: 3,
          [theme.breakpoints.up('lg')]: {
            height: 21,
          },
        }}>
        <Box
          sx={{
            typography: 'body',
            color: '$text',
            display: 'inline-flex',
            alignItems: withAnim ? 'center' : 'flex-end',
            [theme.breakpoints.up('sm')]: {
              alignItems: 'flex-end',
            },
          }}>
          {type === 'for' ? texts.other.toggleFor : texts.other.toggleAgainst}{' '}
          <FormattedNumber
            variant={isValueBig ? 'h3' : 'headline'}
            css={{
              color: '$text',
              transition: 'all 0.5s ease',
              height: 19,
              position: 'relative',
              top: isValueBig ? 2 : 3,
              ml: 4,
              [theme.breakpoints.up('lg')]: {
                height: 21,
                top: 1.5,
              },
              '> p': {
                fontWeight: 600,
              },
            }}
            value={value}
            visibleDecimals={2}
            countUp={withAnim && isValueBig}
            startValueForCountUp={startValueForCountUp}
            compact
          />
        </Box>
        {!isFinished && (
          <Box
            sx={{
              typography: 'body',
              color: '$textSecondary',
              display: 'inline-flex',
              alignItems: withAnim ? 'center' : 'flex-end',
              [theme.breakpoints.up('sm')]: {
                alignItems: 'flex-end',
              },
            }}>
            {texts.other.required}{' '}
            <FormattedNumber
              variant={isRequiredValueBig ? 'h3' : 'headline'}
              css={{
                color: '$text',
                transition: 'all 0.5s ease',
                height: 19,
                position: 'relative',
                top: isRequiredValueBig ? 2 : 3,
                ml: 4,
                [theme.breakpoints.up('lg')]: {
                  height: 21,
                  top: 1.5,
                },
                '> p': {
                  fontWeight: 600,
                },
              }}
              value={requiredValue}
              visibleDecimals={2}
              countUp={withAnim && isRequiredValueBig}
              startValueForCountUp={startRequiredValueForCountUp}
              compact
            />
          </Box>
        )}
      </Box>
      <VoteLine percent={linePercent} width="100%" color={type} />
    </Box>
  );
}
