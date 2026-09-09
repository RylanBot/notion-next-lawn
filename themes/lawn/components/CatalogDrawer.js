import { useEffect, useState } from 'react';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';
import Catalog from './Catalog';

/**
 * 移动端抽屉目录
 */
const CatalogDrawer = ({ toc }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const switchVisible = () => setShowDrawer(!showDrawer);

  useEffect(() => {
    const handleScroll = () => {
      setShowDrawer(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!siteConfig('LAWN_WIDGET_TOC', null, CONFIG)) return <></>;

  return (
    <>
      <button
        type="button"
        className="flex h-7 w-7 cursor-pointer items-center justify-center text-center xl:hidden"
        onClick={switchVisible}
      >
        <i className="fas fa-list-ol text-xs" />
      </button>

      <div className="fixed top-0 right-0 z-40 xl:hidden">
        <div
          className={`animate__animated animate__fast w-64 fixed right-2 bottom-12 ${
            showDrawer ? 'animate__slideInRight' : '-mr-80 animate__slideOutRight'
          }`}
        >
          <Catalog toc={toc} />
        </div>
      </div>

      <div
        className={`${showDrawer ? 'block' : 'hidden'} fixed top-0 left-0 z-30 w-full h-full`}
        onClick={switchVisible}
      />
    </>
  );
};

export default CatalogDrawer;
