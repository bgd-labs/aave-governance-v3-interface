import { Box, SxProps } from '@mui/system';

import { texts } from '../../ui/utils/texts';

interface VotedStateProps {
  support: boolean;
  inProcess?: boolean;
  isBig?: boolean;
  css?: SxProps;
}

export function VotedState({
  support,
  isBig,
  inProcess,
  css,
}: VotedStateProps) {
  return (
    <Box
      component="p"
      sx={{ typography: 'body', color: '$textSecondary', ...css }}>
      {inProcess ? texts.proposals.voting : texts.proposals.voted}{' '}
      <Box
        component="span"
        sx={{
          typography: isBig ? 'h2' : 'headline',
          color:
            isBig && support
              ? '$mainFor'
              : isBig && !support
                ? '$mainAgainst'
                : '$text',
        }}>
        {support ? texts.other.toggleFor : texts.other.toggleAgainst}
      </Box>
    </Box>
  );
}
