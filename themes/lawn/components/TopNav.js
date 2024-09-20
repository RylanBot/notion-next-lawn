import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

import throttle from 'lodash.throttle';

import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';
import CategoryGroup from './CategoryGroup';
import Logo from './Logo';
import { MenuListTop } from './MenuListTop';
import SearchButton from './SearchButton';
import SearchDrawer from './SearchDrawer';
import SideBar from './SideBar';
import SideBarDrawer from './SideBarDrawer';
import TagGroups from './TagGroups';

let windowTop = 0;

/**
 * 顶部导航栏
 */
const TopNav = (props) => {
  const { tags, currentTag, categories, currentCategory } = props;
  const showSearchButton = siteConfig('LAWN_MENU_SEARCH', false, CONFIG);

  const { locale, isDarkMode } = useGlobal();
  const router = useRouter();

  const searchDrawer = useRef();
  const [isOpen, changeShow] = useState(false);

  const throttleMs = 200;
  const handleNavStyle = useCallback(
    throttle(() => {
      const scrollS = window.scrollY;

      const nav = document.querySelector('#sticky-nav');
      const header = document.querySelector('#lawn-header');
      const menuTitle = document.querySelectorAll('.menu-title');

      const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const headerHeight = remToPx(25);
      const navTransparent = (scrollS < headerHeight && router.route === '/') || scrollS < 300;

      if (header && navTransparent) {
        nav && nav.classList.replace('bg-white', 'bg-none');
        nav && nav.classList.replace('text-gray', 'text-white');
        nav && nav.classList.replace('border', 'border-transparent');
        nav && nav.classList.replace('drop-shadow-md', 'shadow-none');
        nav && nav.classList.replace('dark:bg-lawn-black-gray', 'transparent');
      } else {
        nav && nav.classList.replace('bg-none', 'bg-white');
        nav && nav.classList.replace('text-white', 'text-gray');
        nav && nav.classList.replace('border-transparent', 'border');
        nav && nav.classList.replace('shadow-none', 'drop-shadow-md');
        nav && nav.classList.replace('transparent', 'dark:bg-lawn-black-gray');
      }

      menuTitle?.forEach((menu) => {
        if (!isDarkMode && header && navTransparent) {
          menu.parentNode.classList.add('dark');
        } else {
          menu.parentNode.classList.remove('dark');
        }
      });

      const showNav = scrollS <= windowTop || scrollS < 5 || (header && scrollS <= header.clientHeight); // 非首页无大图时影藏顶部 滚动条置顶时隐藏
      if (!showNav) {
        nav && nav.classList.replace('top-0', '-top-20');
        windowTop = scrollS;
      } else {
        nav && nav.classList.replace('-top-20', 'top-0');
        windowTop = scrollS;
      }
    }, throttleMs)
  );

  useEffect(() => {
    handleNavStyle();
    window.addEventListener('scroll', handleNavStyle);
    return () => {
      window.removeEventListener('scroll', handleNavStyle);
    };
  }, [router]);

  const searchDrawerSlot = (
    <>
      {categories && (
        <section className="mt-8">
          <div className="text-sm flex flex-nowrap justify-between font-light px-2">
            <div className="text-gray-600 dark:text-gray-200">
              <i className="mr-2 fas fa-th-list" />
              {locale.COMMON.CATEGORY}
            </div>
            <Link
              href={'/category'}
              passHref
              className="mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer"
            >
              {locale.COMMON.MORE} <i className="fas fa-angle-double-right" />
            </Link>
          </div>
          <CategoryGroup currentCategory={currentCategory} categories={categories} />
        </section>
      )}

      {tags && (
        <section className="mt-4">
          <div className="text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200">
            <div className="text-gray-600 dark:text-gray-200">
              <i className="mr-2 fas fa-tag" />
              {locale.COMMON.TAGS}
            </div>
            <Link
              href={'/tag'}
              passHref
              className="text-gray-400 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
            >
              {locale.COMMON.MORE} <i className="fas fa-angle-double-right" />
            </Link>
          </div>
          <div className="p-2">
            <TagGroups tags={tags} currentTag={currentTag} />
          </div>
        </section>
      )}
    </>
  );

  return (
    <nav id="lawn-top-nav">
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

      {/* 导航栏 */}
      <div
        id="sticky-nav"
        style={{ backdropFilter: 'blur(3px)' }}
        className="top-0 duration-300 transition-all shadow-none fixed bg-none dark:bg-lawn-black-gray dark:text-gray-200 text-black w-full z-20 transform border-transparent dark:border-transparent"
      >
        <div className="w-full flex justify-between items-center px-4 py-2">
          <div className="">
            <Logo {...props} />
          </div>

          {/* 右侧菜单 */}
          <div className="mr-1 flex justify-end items-center text-xl">
            <div className="hidden lg:flex">
              <MenuListTop {...props} />
            </div>
            <div
              onClick={() => changeShow(!isOpen)}
              className="w-8 justify-center items-center h-8 cursor-pointer flex lg:hidden"
            >
              <span className="menu-title text-gray-700 dark:text-gray-200">
                {isOpen ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
              </span>
            </div>
            {showSearchButton && <SearchButton />}
          </div>
        </div>
      </div>

      {/* 折叠侧边栏 */}
      <SideBarDrawer isOpen={isOpen} onClose={() => changeShow(false)}>
        <SideBar {...props} />
      </SideBarDrawer>
    </nav>
  );
};

export default TopNav;
