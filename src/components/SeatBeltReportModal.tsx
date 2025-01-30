import { Box } from '@mui/system';
import React, { useRef } from 'react';

import { BasicModal } from './BasicModal';
import { CopyAndExternalIconsSet } from './CopyAndExternalIconsSet';
import { MarkdownContainer } from './MarkdownContainer';

interface SeatBeltReportModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  link: string;
  report?: string;
}

export function SeatBeltReportModal({
  isOpen,
  setIsOpen,
  link,
  report,
}: SeatBeltReportModalProps) {
  const initialFocusRef = useRef(null);

  if (!report) return null;

  return (
    <BasicModal
      maxWidth={980}
      initialFocus={initialFocusRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton>
      <Box
        sx={{
          mb: 24,
          display: 'flex',
          alignItems: 'center',
        }}>
        <Box sx={{ typography: 'h1' }}>Seatbelt Report</Box>
        <CopyAndExternalIconsSet
          iconSize={16}
          externalLink={link}
          sx={{ '.CopyAndExternalIconsSet__link': { ml: 8 } }}
        />
      </Box>

      <MarkdownContainer markdown={report} />
    </BasicModal>
  );
}
