'use client';

import { Pagination } from '../Pagination';

export const ProposalsPagination = ({
  activePage,
  totalItems,
}: {
  activePage: number;
  totalItems: number;
}) => {
  return <Pagination forcePage={activePage} totalItems={totalItems} />;
};
