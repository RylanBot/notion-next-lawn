import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import throttle from 'lodash.throttle';

import useDarkMode from '@/hooks/useDarkMode';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';
import CategoryGroup from './CategoryGroup';
import Logo from './Logo';
import MenuListTop from './MenuListTop';
import SearchButton from './SearchButton';
import SearchDrawer from './SearchDrawer';
import SideBar from './SideBar';
import SideBarDrawer from './SideBarDrawer';
import TagGroups from './TagGroups';

/**
 * 顶部导航栏
 */
const TopNav = (props) => {
  const { tags, currentTag, categories, currentCategory } = props;
  const SHOW_SEARCH_BUTTON = siteConfig('LAWN_MENU_SEARCH', false, CONFIG);

  const { locale } = useGlobal();
  const { isDarkMode } = useDarkMode();
  const router = useRouter();

  const searchDrawer = useRef();
  const windowTopRef = useRef(0);
  const autoHideTimerRef = useRef(null);
  const navRef = useRef(null);

  const [isMouseOverNav, setIsMouseOverNav] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseOverNav(true);
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsMouseOverNav(false);
  };

  const handleNavStyle = throttle(() => {
    const scrollS = window.scrollY;

    const header = document.querySelector('#lawn-header');
    const nav = document.querySelector('#sticky-nav');
    const navTitle = document.querySelector('#nav-title');

    const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const headerHeight = remToPx(25);

    const isHome = router.route === '/';
    const navTransparent = (scrollS < headerHeight && isHome) || scrollS < 300;

    if (header && navTransparent) {
      nav?.classList.replace('bg-white', 'bg-none');
      nav?.classList.replace('text-gray', 'text-white');
      nav?.classList.replace('border', 'border-transparent');
      nav?.classList.replace('drop-shadow-md', 'shadow-none');
      nav?.classList.replace('dark:bg-lawn-black-gray', 'transparent');

      if (isHome) {
        navTitle?.classList.replace('opacity-100', 'opacity-0');
        navTitle?.classList.replace('pointer-events-auto', 'pointer-events-none');
      } else {
        navTitle?.classList.replace('opacity-0', 'opacity-100');
        navTitle?.classList.replace('pointer-events-none', 'pointer-events-auto');
      }
    } else {
      nav?.classList.replace('bg-none', 'bg-white');
      nav?.classList.replace('text-white', 'text-gray');
      nav?.classList.replace('border-transparent', 'border');
      nav?.classList.replace('shadow-none', 'drop-shadow-md');
      nav?.classList.replace('transparent', 'dark:bg-lawn-black-gray');

      if (isHome) {
        // 首页禁止点击 Logo 跳转
        navTitle?.classList.replace('opacity-0', 'opacity-100');
        navTitle?.classList.replace('pointer-events-auto', 'pointer-events-none');
      } else {
        navTitle?.classList.replace('pointer-events-none', 'pointer-events-auto');
      }
    }

    const menuTitle = document.querySelectorAll('.menu-title');
    menuTitle?.forEach((menu) => {
      if (!isDarkMode && header && navTransparent) {
        menu.parentNode.classList.add('dark');
      } else {
        menu.parentNode.classList.remove('dark');
      }
    });

    const isScrollUp = scrollS <= windowTopRef.current; // 是否为向上滚动
    const isInHeaderView = scrollS <= header?.clientHeight; // 在顶部封面可见范围
    const showNav = isScrollUp || isInHeaderView || scrollS < 5;
    if (!showNav) {
      nav?.classList.replace('top-0', '-top-20');
    } else {
      nav?.classList.replace('-top-20', 'top-0');

      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }

      // 3 秒后如果用户没有新的滚动，且鼠标不在 nav 上，则自动隐藏
      autoHideTimerRef.current = setTimeout(() => {
        if (!isMouseOverNav && !isInHeaderView) {
          nav?.classList.replace('top-0', '-top-20');
        }
      }, 3000);
    }

    windowTopRef.current = scrollS;
  }, 200);

  useEffect(() => {
    handleNavStyle();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const header = document.querySelector('#lawn-header'); // Hero + PostHeader
        if (header) {
          handleNavStyle(); // 避免偶尔路由跳转时，没有同步 Header 状态
          observer.disconnect();
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener('scroll', handleNavStyle);
    return () => {
      window.removeEventListener('scroll', handleNavStyle);
    };
  }, [router.asPath]);

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
    <nav id="lawn-top-nav" ref={navRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

      {/* 导航栏 */}
      <div
        id="sticky-nav"
        style={{ backdropFilter: 'blur(3px)' }}
        className="top-0 transition-all shadow-none fixed bg-none dark:bg-lawn-black-gray dark:text-gray-200 text-black w-full z-20 transform border-transparent dark:border-transparent"
      >
        <div className="w-full flex justify-between items-center px-4 py-2">
          <div id="nav-title" className="opacity-100 pointer-events-auto">
            <Logo />
          </div>

          {/* 右侧菜单 */}
          <div className="mr-1 flex justify-end items-center text-xl">
            <div className="hidden lg:flex">
              <MenuListTop {...props} />
            </div>
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 justify-center items-center h-8 cursor-pointer flex lg:hidden"
            >
              <span className="menu-title text-gray-700 dark:text-gray-200">
                {isMenuOpen ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
              </span>
            </div>
            {SHOW_SEARCH_BUTTON && <SearchButton />}
          </div>
        </div>
      </div>

      {/* 折叠侧边栏 */}
      <SideBarDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <SideBar {...props} />
      </SideBarDrawer>
    </nav>
  );
};

export default TopNav;
