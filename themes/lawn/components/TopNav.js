import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import throttle from 'lodash.throttle';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CategoryGroup from './CategoryGroup';
import Logo from './Logo';
import MenuListTop from './MenuListTop';
import NavActionArea from './NavActionArea';
import SearchButton from './SearchButton';
import SideBar from './SideBar';
import SideBarDrawer from './SideBarDrawer';
import TagGroups from './TagGroups';

/**
 * 顶部导航栏
 */
const TopNav = (props) => {
  const { tags, currentTag, categories, currentCategory } = props;

  const SHOW_SEARCH_BUTTON = Boolean(siteConfig('ALGOLIA_APP_ID'));

  const router = useRouter();
  const { locale } = useGlobal();

  const windowTopRef = useRef(0);
  const autoHideTimerRef = useRef(null);
  const navRef = useRef(null);

  const [isMouseOverNav, setIsMouseOverNav] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseOverNav(true);
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    setHidden(false);
  };

  const handleMouseLeave = () => {
    setIsMouseOverNav(false);
  };

  const handleNavStyle = throttle(() => {
    const scrollY = window.scrollY;
    const header = document.querySelector('#lawn-header');
    const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const paddingTop = remToPx(4);

    const headerHeight = header?.clientHeight || 0;
    const nextInHero = Boolean(header) && scrollY < Math.max(headerHeight - 48, 120);

    const isScrollUp = scrollY <= windowTopRef.current;
    const showNav = isScrollUp || nextInHero || scrollY < paddingTop;

    setHidden(!showNav);

    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    if (showNav && scrollY > 0 && !nextInHero) {
      autoHideTimerRef.current = setTimeout(() => {
        if (!isMouseOverNav) setHidden(true);
      }, 3000);
    }

    windowTopRef.current = scrollY;
  }, 200);

  useEffect(() => {
    handleNavStyle();

    const observer = new MutationObserver(() => {
      const header = document.querySelector('#lawn-header');
      if (header) {
        handleNavStyle();
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });

    window.addEventListener('scroll', handleNavStyle);
    return () => {
      window.removeEventListener('scroll', handleNavStyle);
      observer.disconnect();
      if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
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
              className="mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer"
              passHref
              href={'/category'}
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
              className="text-gray-400 hover:text-black dark:hover:text-white hover:underline cursor-pointer"
              passHref
              href={'/tag'}
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

  const isHome = router.pathname === '/';
  const pillClass =
    'flex h-11 items-center rounded-full border border-teal-900/10 bg-white/90 shadow-md backdrop-blur-sm dark:border-white/15 dark:bg-zinc-900/90';

  return (
    <nav id="lawn-top-nav" ref={navRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        id="lawn-sticky-nav"
        className={clsx('fixed top-0 z-20 w-full transition-transform duration-300', hidden && '-translate-y-full')}
      >
        <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 md:px-8 xl:px-12">
          <div className="justify-self-start">
            {!isHome && (
              <div id="lawn-nav-title" className={clsx(pillClass, 'group px-5')}>
                <Logo />
              </div>
            )}
          </div>

          <div className={clsx(pillClass, 'hidden px-1.5 empty:hidden xl:flex')}>
            <MenuListTop {...props} />
          </div>

          <div className={clsx(pillClass, 'col-start-3 justify-self-end gap-0.5 px-2 text-teal-900 dark:text-white')}>
            <div className="menu-title max-xl:hidden">
              <NavActionArea className="gap-0.5" />
            </div>

            {SHOW_SEARCH_BUTTON && <SearchButton />}

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-teal-700/10 hover:text-teal-700 dark:hover:bg-white/10 dark:hover:text-teal-500 xl:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
            </button>
          </div>
        </div>
      </div>

      <SideBarDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <SideBar {...props} />
      </SideBarDrawer>
    </nav>
  );
};

export default TopNav;
