import { Box } from '@mui/system';
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
import Emoji from 'react-emoji-render';

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
      component={Emoji}
      sx={{
        wordBreak: 'break-word',
        '> span': { verticalAlign: 'top !important' },
      }}>
      {children}
    </Box>
  );
}
