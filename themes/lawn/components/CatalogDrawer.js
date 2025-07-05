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
        className="cursor-pointer transform duration-200 flex justify-center items-center text-center lg:hidden"
        onClick={switchVisible}
      >
        <i className="fas fa-list-ol text-xs" />
      </button>

      <div className="fixed top-0 right-0 z-40 lg:hidden">
        <div
          className={`animate__animated animate__fast w-60 duration-100 fixed right-12 bottom-12 rounded py-2 bg-white dark:bg-lawn-black-gray shadow-sm shadow-gray-400 ${
            showDrawer ? 'animate__slideInRight' : '-mr-72 animate__slideOutRight'
          }`}
        >
          <Catalog toc={toc} />
        </div>
      </div>

      {/* 背景蒙版 */}
      <div
        className={`${showDrawer ? 'block' : 'hidden'} fixed top-0 left-0 z-30 w-full h-full`}
        onClick={switchVisible}
      />
    </>
  );
};

export default CatalogDrawer;
