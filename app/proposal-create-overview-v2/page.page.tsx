import { Metadata } from 'next';
import React from 'react';

import { ProposalCreateOverviewV2Page } from '../../src/proposalCreateOverviewV2/components/ProposalCreateOverviewV2Page';
import { metaTexts } from '../../src/ui/utils/metaTexts';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export default function ProposalCreateOverviewV2() {
  return <ProposalCreateOverviewV2Page />;
}
