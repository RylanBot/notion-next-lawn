import { useEffect, useState } from 'react';

import Typed from 'typed.js';

import LazyImage from '@/components/LazyImage';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';
import NavButtonGroup from './NavButtonGroup';

let wrapperTop = 0;

/**
 * 首页全屏大图
 */
const Hero = (props) => {
  const { siteInfo } = props;
  const { locale, setOnLoading } = useGlobal();

  const TITLE = siteConfig('TITLE');
  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',');
  const LAWN_HOME_NAV_BUTTONS = siteConfig('LAWN_HOME_NAV_BUTTONS', null, CONFIG);
  const LAWN_SHOW_START_READING = siteConfig('LAWN_SHOW_START_READING', null, CONFIG);
  const LAWN_HOME_NAV_BACKGROUND_IMG_FIXED = siteConfig('LAWN_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG);

  const [typed, setTyped] = useState();
  const [showHero, setShowHero] = useState();

  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' });
  };

  const updateHeaderHeight = () => {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('lawn-main-wrapper');
      wrapperTop = wrapperElement?.offsetTop;
    });
  };

  const handleCoverLoaded = () => {
    setShowHero(true);
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
  }, [showHero]);

  return (
    <div id="lawn-header" className="relative bg-white w-full h-screen">
      {/* 首页大图 */}
      <LazyImage
        id="lawn-header-cover"
        src={siteInfo?.pageCover}
        onLoad={handleCoverLoaded}
        placeholderSrc={siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')}
        className={`${
          LAWN_HOME_NAV_BACKGROUND_IMG_FIXED ? 'fixed' : ''
        } header-cover w-full h-screen object-cover object-center`}
      />
      {/* 深色遮罩 */}
      <div className="absolute inset-0 bg-black opacity-10 z-10"></div>

      {showHero && (
        <div className="text-white absolute bottom-0 flex flex-col h-full items-center justify-center w-full z-20">
          {/* 站点标题 */}
          <div className="text-center font-black text-7xl lg:text-8xl shadow-text">{TITLE}</div>

          {/* 站点欢迎语 */}
          <div className="mt-12 h-12 items-center text-center font-medium shadow-text text-2xl">
            <span id="typed" />
          </div>

          {/* 首页导航大按钮 */}
          {LAWN_HOME_NAV_BUTTONS && <NavButtonGroup {...props} />}

          {/* 滚动按钮 */}
          <div
            onClick={scrollToWrapper}
            className="z-30 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-10 text-white"
          >
            <div className="opacity-70 animate-bounce text-xs">
              {LAWN_SHOW_START_READING && locale.COMMON.START_READING}
            </div>
            <i className="opacity-70 animate-bounce fas fa-angle-down" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
