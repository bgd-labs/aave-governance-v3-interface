import { Box, SxProps } from '@mui/system';

export interface SpinnerProps {
  css?: SxProps;
  size: number;
  loaderLineColor: string;
  loaderCss: SxProps;
  lineSize?: number;
}

export function Spinner({
  css,
  size,
  loaderLineColor,
  loaderCss,
  lineSize = 2,
}: SpinnerProps) {
  return (
    <Box
      sx={{
        borderRadius: '50%',
        position: 'relative',
        width: size,
        height: size,
        transform: 'translateZ(0)',
        background: 'inherit',
        backgroundImage: 'inherit',
        backgroundColor: 'inherit',
        overflow: 'hidden',
        ...css,
      }}>
      <Box
        sx={{
          position: 'absolute',
          inset: lineSize,
          borderRadius: '50%',
          background: 'inherit',
          backgroundColor: 'inherit',
          backgroundImage: 'inherit',
          zIndex: 4,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          borderRadius: '50%',
          width: size,
          height: size,
          zIndex: 2,
          backgroundColor: loaderLineColor,
        }}
      />

      <Box
        sx={{
          '@keyframes load': {
            to: {
              transform: 'rotate(360deg)',
            },
          },
          position: 'absolute',
          top: -1,
          width: size / 2 + 2,
          height: size + 2,
          zIndex: 3,
          borderRadius: '50% 0 0 50%',
          transformOrigin: `${size / 2}px ${size / 2}px`,
          left: -1,
          animation: `load 2s infinite ease 1.5s`,
          ...loaderCss,
        }}
      />

      <Box
        sx={{
          '@keyframes load': {
            to: {
              transform: 'rotate(360deg)',
            },
          },
          position: 'absolute',
          top: -1,
          width: size / 2 + 2,
          height: size + 2,
          zIndex: 3,
          borderRadius: '0 50% 50% 0',
          transformOrigin: `0 ${size / 2}px`,
          left: size / 2 - 1,
          animation: `load 2s infinite ease`,
          ...loaderCss,
        }}
      />
    </Box>
  );
}
