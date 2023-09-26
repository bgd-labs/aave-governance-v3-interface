import { Metadata } from 'next';
import React from 'react';

import { CreateProposalPage } from '../../src/ui/pages/CreateProposalPage';
import { texts } from '../../src/ui/utils/texts';

export const metadata: Metadata = {
  title: `${texts.meta.main}${texts.meta.createPageMetaTitle}`,
  description: texts.meta.createPageMetaDescription,
  openGraph: {
    title: `${texts.meta.main}${texts.meta.createPageMetaTitle}`,
    description: texts.meta.createPageMetaDescription,
  },
};

export default function Page() {
  return <CreateProposalPage />;
}
