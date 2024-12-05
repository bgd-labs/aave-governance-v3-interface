'use client';

import React, { useEffect } from 'react';

import { ProposalLoading } from '../../../components/ProposalsDetails/ProposalLoading';

export default function LoadingPage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return <ProposalLoading withContainer />;
}
