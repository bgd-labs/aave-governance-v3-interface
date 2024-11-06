'use client';

import 'nprogress/nprogress.css';

import React from 'react';

import { MainLayout } from './MainLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainLayout>{children}</MainLayout>
    </>
  );
}
