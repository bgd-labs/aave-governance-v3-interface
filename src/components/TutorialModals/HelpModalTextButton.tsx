import { Box } from '@mui/system';
import { ReactNode } from 'react';

interface HelpModalTextButtonProps {
  onClick: () => void;
  children: ReactNode;
  white?: boolean;
}

export function HelpModalTextButton({
  onClick,
  children,
  white,
}: HelpModalTextButtonProps) {
  return (
    <Box
      component="span"
      onClick={onClick}
      className="HelpModalTextButton"
      sx={(theme) => ({
        display: 'inline',
        cursor: 'pointer',
        color: white ? '$textWhite' : '$textSecondary',
        textDecoration: 'underline',
        transition: 'all 0.2s ease',
        hover: {
          color: white ? theme.palette.$textSecondary : theme.palette.$text,
        },
      })}>
      {children}
    </Box>
  );
}
