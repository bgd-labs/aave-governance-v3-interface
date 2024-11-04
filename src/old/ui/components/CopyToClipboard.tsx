import { Box } from '@mui/system';
import React, { ReactNode, useState } from 'react';
import { CopyToClipboard as CTC } from 'react-copy-to-clipboard';

import { texts } from '../utils/texts';
import { Tooltip } from './Tooltip';

interface CopyToClipboardProps {
  copyText: string;
  copyTooltipText?: string;
  children: ReactNode;
}

export function CopyToClipboard({
  copyText,
  copyTooltipText,
  children,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  return (
    <CTC
      text={copyText}
      onCopy={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }}>
      <Box sx={{ lineHeight: 0 }}>
        <Tooltip
          color={copied ? 'dark' : 'light'}
          tooltipContent={
            <Box component="span" sx={{ typography: 'descriptor' }}>
              {copied
                ? texts.other.copied
                : copyTooltipText || texts.other.copy}
            </Box>
          }>
          {children}
        </Tooltip>
      </Box>
    </CTC>
  );
}
