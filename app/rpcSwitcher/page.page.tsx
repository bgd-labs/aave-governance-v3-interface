import { Metadata } from 'next';
import React from 'react';

import { RpcSwitcherPage } from '../../src/rpcSwitcher/components/RpcSwitcherPage';
import { metaTexts } from '../../src/ui/utils/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.representationsPageMetaTitle}`,
  description: metaTexts.representationsPageMetaDescription,
  openGraph: {
    title: `${metaTexts.main}${metaTexts.representationsPageMetaTitle}`,
    description: metaTexts.representationsPageMetaDescription,
  },
};

export default function Page() {
  return <RpcSwitcherPage />;
}
