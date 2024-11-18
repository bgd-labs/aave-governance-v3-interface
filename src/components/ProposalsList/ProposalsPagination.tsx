'use client';

import { useRouter } from 'next/navigation';

import { Pagination } from '../Pagination';

export const ProposalsPagination = ({
  activePage,
  totalPages,
}: {
  activePage: number;
  totalPages: number;
}) => {
  const router = useRouter();
  return (
    <Pagination
      forcePage={activePage}
      pageCount={totalPages}
      onPageChange={(page) => router.push(`/${page + 1}/`)}
    />
  );
};
