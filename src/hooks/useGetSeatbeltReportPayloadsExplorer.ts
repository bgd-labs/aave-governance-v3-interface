'use client';

import { useState } from 'react';

import { generateSeatbeltLink } from '../helpers/formatPayloadData';
import { PayloadWithHashes } from '../types';

export function useGetSeatbeltReportPayloadsExplorer() {
  const [isSeatbeltModalOpen, setIsSeatbeltModalOpen] = useState<
    Record<string, boolean>
  >({});
  const [isSeatbeltReportLoading, setIsSeatbeltReportLoadingOpen] = useState<
    Record<string, boolean>
  >({});
  const [finalReport, setFinalReport] = useState<string | undefined>(undefined);
  const [reportPayload, setReportPayload] = useState<
    PayloadWithHashes | undefined
  >(undefined);

  const handleReportClick = async (payload: PayloadWithHashes) => {
    const key = `${payload.payloadsController}_${Number(payload.id)}`;
    setReportPayload(payload);
    setIsSeatbeltReportLoadingOpen({
      ...isSeatbeltReportLoading,
      [key]: true,
    });
    const seatbeltMDRequest = await fetch(generateSeatbeltLink(payload));
    const seatbeltMD = seatbeltMDRequest.ok
      ? await seatbeltMDRequest.text()
      : undefined;
    setFinalReport(seatbeltMD);
    if (seatbeltMD) {
      setIsSeatbeltModalOpen({
        ...isSeatbeltModalOpen,
        [key]: true,
      });
      setIsSeatbeltReportLoadingOpen({
        ...isSeatbeltReportLoading,
        [key]: false,
      });
    }
  };

  const handleSeatbeltModalOpen = (value: boolean) => {
    if (reportPayload) {
      setFinalReport(undefined);
      setIsSeatbeltModalOpen({
        ...isSeatbeltModalOpen,
        [`${reportPayload.payloadsController}_${reportPayload.id}`]: value,
      });
    }
  };

  return {
    isSeatbeltModalOpen,
    setIsSeatbeltModalOpen,
    isSeatbeltReportLoading,
    setIsSeatbeltReportLoadingOpen,
    finalReport,
    setFinalReport,
    reportPayload,
    setReportPayload,
    handleReportClick,
    handleSeatbeltModalOpen,
  };
}
