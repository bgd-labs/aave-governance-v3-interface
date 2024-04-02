import { useRootStore } from '../../store/storeProvider';
import { Pagination } from '../../ui';
import { selectProposalsPages } from '../store/proposalsSelectors';

export const ProposalsPagination = () => {
  const pages = useRootStore((state) => selectProposalsPages(state));
  const setActivePage = useRootStore((state) => state.setActivePage);
  const activePage = useRootStore((state) => state.activePage);

  return (
    <Pagination
      forcePage={activePage}
      pageCount={pages.length}
      onPageChange={setActivePage}
    />
  );
};
