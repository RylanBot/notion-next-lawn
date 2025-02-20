import { useRouter } from 'next/router';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import { useLawnGlobal } from '..';

/**
 * 搜索按钮
 */
export default function SearchButton(props) {
  const { locale } = useGlobal();
  const router = useRouter();
  const { searchModal } = useLawnGlobal();

  function handleSearch() {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch();
    } else {
      router.push('/search');
    }
  }

  return (
    <>
      <div
        onClick={handleSearch}
        title={locale.NAV.SEARCH}
        alt={locale.NAV.SEARCH}
        className="cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all"
      >
        <i title={locale.NAV.SEARCH} className="fa-solid fa-magnifying-glass" />
      </div>
    </>
  );
}
