import { Metadata } from 'next';
import React from 'react';

import { metaTexts } from '../../helpers/texts/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.rpcSwitcherPageMetaTitle}`,
  description: metaTexts.rpcSwitcherPageMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.main}${metaTexts.rpcSwitcherPageMetaTitle}`,
    description: metaTexts.rpcSwitcherPageMetaDescription,
  },
};

export default function Page() {
  return <h1>Create page</h1>;
}
