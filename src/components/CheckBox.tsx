import { Box, useTheme } from '@mui/system';

interface CheckBoxProps {
  value: boolean;
}

export function CheckBox({ value }: CheckBoxProps) {
  const theme = useTheme();

  return (
    <Box
      className="CheckBox"
      sx={{
        width: 15,
        height: 15,
        border: `1px solid ${theme.palette.$main}`,
        background: '$paper',
        borderTop: `3px solid ${theme.palette.$main}`,
        borderRight: `3px solid ${theme.palette.$main}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        mr: 6,
        hover: {
          background: theme.palette.$disabled,
        },
      }}>
      <Box
        sx={{
          width: value ? 7 : 0,
          height: value ? 7 : 0,
          background: theme.palette.$main,
          position: 'absolute',
        }}
      />
    </Box>
  );
}
