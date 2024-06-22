import { useEffect, useState } from 'react';

import Typed from 'typed.js';

import LazyImage from '@/components/LazyImage';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';
import NavButtonGroup from './NavButtonGroup';

let wrapperTop = 0;

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const { siteInfo } = props;
  const { locale, setOnLoading } = useGlobal();
  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',');

  const [typed, setTyped] = useState();
  const [showHeader, setShowHeader] = useState();

  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' });
  };

  const updateHeaderHeight = () => {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper');
      wrapperTop = wrapperElement?.offsetTop;
    });
  };

  const handleCoverLoaded = () => {
    setShowHeader(true);
    setOnLoading(false);
  };

  useEffect(() => {
    setOnLoading(true);
  }, []);

  useEffect(() => {
    updateHeaderHeight();

    if (!typed && window && document.getElementById('typed')) {
      setTyped(
        new Typed('#typed', {
          strings: GREETING_WORDS,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 200,
          showCursor: true,
          smartBackspace: true
        })
      );
    }

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [showHeader]);

  return (
    <div id="hexo-header"
      style={{ zIndex: 1 }}
      className="bg-white w-full h-screen relative"
    >
      {showHeader && (
        <div className="text-white absolute bottom-0 flex flex-col h-full items-center justify-center w-full">
          {/* 站点标题 */}
          <div className='text-center font-black text-7xl lg:text-8xl shadow-text'>{siteConfig('TITLE')}</div>

          {/* 站点欢迎语 */}
          <div className='mt-12 h-12 items-center text-center font-medium shadow-text text-2xl'>
            <span id='typed' />
          </div>

          {/* 首页导航大按钮 */}
          {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && <NavButtonGroup {...props} />}

          {/* 滚动按钮 */}
          <div onClick={scrollToWrapper} className="z-10 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-10 text-white">
            <div className="opacity-70 animate-bounce text-xs">{siteConfig('HEXO_SHOW_START_READING', null, CONFIG) && locale.COMMON.START_READING}</div>
            <i className='opacity-70 animate-bounce fas fa-angle-down' />
          </div>
        </div>
      )}

      {/* 首页大图 */}
      <LazyImage
        id='hexo-header-cover'
        className={`header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`}
        src={siteInfo?.pageCover}
        onLoad={handleCoverLoaded}
        placeholderSrc={siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')}
      />
    </div>
  );
};

export default Hero;
