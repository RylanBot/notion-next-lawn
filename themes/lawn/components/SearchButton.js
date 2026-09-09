import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import { useLawnGlobal } from '..';

/**
 * 搜索按钮
 */
export default function SearchButton() {
  const { locale } = useGlobal();
  const { searchModal } = useLawnGlobal();

  if (!siteConfig('ALGOLIA_APP_ID')) return null;

  function handleSearch() {
    searchModal.current.openSearch();
  }

  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-teal-700/10 hover:text-teal-700 dark:hover:bg-white/10 dark:hover:text-teal-500"
      title={locale.NAV.SEARCH}
      onClick={handleSearch}
    >
      <i className="fa-solid fa-magnifying-glass text-sm" />
    </button>
  );
}
