import { Metadata } from 'next';
import React from 'react';

import { CreateProposalPage } from '../../src/ui/pages/CreateProposalPage';
import { metaTexts } from '../../src/ui/utils/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.createPageMetaTitle}`,
  description: metaTexts.createPageMetaDescription,
  openGraph: {
    title: `${metaTexts.main}${metaTexts.createPageMetaTitle}`,
    description: metaTexts.createPageMetaDescription,
  },
};

export default function Page() {
  return <CreateProposalPage />;
}
