import { Metadata } from 'next';
import React from 'react';

import { metaTexts } from '../../helpers/texts/metaTexts';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export default async function ProposalCreateOverview() {
  return <h1>Create proposal overview</h1>;
}
