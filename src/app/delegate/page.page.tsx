import { Metadata } from 'next';
import React from 'react';

import { metaTexts } from '../../helpers/texts/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.delegatePageMetaTitle}`,
  description: metaTexts.delegatePageMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.main}${metaTexts.delegatePageMetaTitle}`,
    description: metaTexts.delegatePageMetaDescription,
  },
};

export default function Page() {
  return <h1>Delegate page</h1>;
}
