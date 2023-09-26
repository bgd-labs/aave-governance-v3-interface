import { useStore } from '../../store';
import { Pagination } from '../../ui';
import { selectProposalsPages } from '../store/proposalsSelectors';

export const ProposalsPagination = () => {
  const pages = useStore((state) => selectProposalsPages(state));
  const setActivePage = useStore((state) => state.setActivePage);
  const activePage = useStore((state) => state.activePage);

  return (
    <Pagination
      forcePage={activePage}
      pageCount={pages.length}
      onPageChange={setActivePage}
    />
  );
};
