'use client';

import { useEffect } from 'react';

import { PayloadDetailsLoading } from '../../../../components/PayloadsExplorer/PayloadDetailsLoading';

export default function LoadingPage() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
  return <PayloadDetailsLoading />;
}
