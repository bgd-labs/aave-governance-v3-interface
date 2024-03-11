import { Box } from '@mui/system';
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';

export interface TextWithEmojiProps {
  children:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal
    | null;
}

export function TextWithEmoji({ children }: TextWithEmojiProps) {
  return (
    <Box
      component="span"
      sx={{
        wordBreak: 'break-word',
        '> span': { verticalAlign: 'top !important' },
      }}>
      {children}
    </Box>
  );
}
