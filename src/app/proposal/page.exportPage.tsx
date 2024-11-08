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

export default function Page() {
  return <h1>Export proposal page</h1>;
}
