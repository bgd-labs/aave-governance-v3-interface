'use client';

import React, { useEffect } from 'react';

import { ProposalLoading } from '../../../components/ProposalsDetails/ProposalLoading';

export default function Loading() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return <ProposalLoading withContainer />;
}
