import { Box } from '@mui/system';
import React, { ReactNode, useState } from 'react';

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

  const handleCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Box onClick={handleCopy} sx={{ lineHeight: 0, cursor: 'pointer' }}>
      <Tooltip
        color={copied ? 'dark' : 'light'}
        tooltipContent={
          <Box component="span" sx={{ typography: 'descriptor' }}>
            {copied ? texts.other.copied : copyTooltipText || texts.other.copy}
          </Box>
        }>
        {children}
      </Tooltip>
    </Box>
  );
}
