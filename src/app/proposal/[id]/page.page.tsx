import { Metadata } from 'next';
import React from 'react';

import { metaTexts } from '../../../helpers/texts/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.createPageMetaTitle}`,
  description: metaTexts.createPageMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.main}${metaTexts.createPageMetaTitle}`,
    description: metaTexts.createPageMetaDescription,
  },
};

export default function Page() {
  return <h1>Proposal page</h1>;
}
