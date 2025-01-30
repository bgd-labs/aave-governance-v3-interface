import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function updateQueryParams({
  router,
  params,
  pathName,
  fromEmpty,
}: {
  router: AppRouterInstance;
  params: Record<string, string[]>;
  pathName?: string;
  fromEmpty?: boolean;
}) {
  const search = window.location.search.substr(1);
  const queryParams = new URLSearchParams(fromEmpty ? '' : search);
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      queryParams.set(key, value.join(','));
    } else {
      queryParams.set(key, value);
    }
  }
  router.push(
    (pathName ?? window.location.pathname) + '?' + queryParams.toString(),
    {
      scroll: false,
    },
  );
}
