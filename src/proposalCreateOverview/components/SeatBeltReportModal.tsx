import { Box } from '@mui/system';
import React, { useRef } from 'react';

import { BasicModal } from '../../ui';
import { MarkdownContainer } from '../../ui/components/MarkdownContainer';

interface SeatBeltReportModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  report?: string;
}

export function SeatBeltReportModal({
  isOpen,
  setIsOpen,
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
      <Box sx={{ typography: 'h1', mb: 24 }}>Seatbelt Report</Box>

      <MarkdownContainer markdown={report} />
    </BasicModal>
  );
}
