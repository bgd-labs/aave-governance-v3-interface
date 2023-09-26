import { Metadata } from 'next';
import React from 'react';

import { ComingSoonPage } from '../src/ui/pages/ComingSoonPage';
import { texts } from '../src/ui/utils/texts';

export const metadata: Metadata = {
  title: `${texts.meta.main}${texts.meta.ipfsTitle}`,
  description: texts.meta.ipfsDescription,
  openGraph: {
    title: `${texts.meta.main}${texts.meta.ipfsTitle}`,
    description: texts.meta.ipfsDescription,
  },
};

export default function Home() {
  return <ComingSoonPage />;
}
