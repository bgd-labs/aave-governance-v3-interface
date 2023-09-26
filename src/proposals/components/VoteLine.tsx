import { Box } from '@mui/system';

export interface VoteLineProps {
  percent: number;
  color?: 'for' | 'against';
  width?: string | number;
}

export function VoteLine({
  percent,
  color = 'for',
  width = 164,
}: VoteLineProps) {
  return (
    <Box
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        height: 11,
        width: width,
        backgroundColor: '$mainLight',
        borderColor: `${theme.palette.$mainElements} !important`,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderTopWidth: 3,
        borderRightWidth: 3,
        [theme.breakpoints.up('lg')]: {
          height: 10,
          borderTopWidth: 3,
          borderRightWidth: 3,
        },
      })}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          width: `${percent}%`,
          minWidth: 2,
          maxWidth: '100%',
          height: '100%',
          transition: 'all 0.2s ease',
          backgroundColor: color === 'for' ? '$mainFor' : '$mainAgainst',
        }}
      />
    </Box>
  );
}
