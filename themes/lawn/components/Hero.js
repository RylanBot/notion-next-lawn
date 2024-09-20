import { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';

import LazyImage from '@/components/LazyImage';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';
import NavButtonGroup from './NavButtonGroup';
import WavesArea from './WavesArea';

let wrapperTop = 0;

/**
 * 首页全屏大图
 */
const Hero = ({ onLoad, ...props }) => {
  const { siteInfo } = props;
  const { locale, setOnLoading } = useGlobal();

  const WAITING_TIME = siteConfig('POST_WAITING_TIME_FOR_404');
  const TITLE = siteConfig('TITLE');
  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',');
  const LAWN_HOME_NAV_BUTTONS = siteConfig('LAWN_HOME_NAV_BUTTONS', null, CONFIG);
  const LAWN_SHOW_START_READING = siteConfig('LAWN_SHOW_START_READING', null, CONFIG);
  const LAWN_HOME_NAV_BACKGROUND_IMG_FIXED = siteConfig('LAWN_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG);

  const [showHero, setShowHero] = useState(false);
  const typedEl = useRef(null);

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
    onLoad();
  };

  useEffect(() => {
    setOnLoading(true);

    // 避免网络较差的时候，一直无法进入首页
    const timer = setTimeout(handleCoverLoaded, WAITING_TIME * 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    updateHeaderHeight();

    const typed = new Typed(typedEl.current, {
      strings: GREETING_WORDS,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 300,
      showCursor: true,
      smartBackspace: true
    });

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      typed.destroy();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  return (
    <div
      id="lawn-header"
      className={`relative flex flex-col justify-center items-center bg-white z-1 w-full h-[25rem] ${
        showHero ? '' : 'opacity-0'
      }`}
    >
      {/* 首页大图 */}
      <LazyImage
        id="lawn-header-cover"
        src={siteInfo?.pageCover}
        onLoad={handleCoverLoaded}
        priority={true}
        placeholderSrc={siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')}
        className={`${
          LAWN_HOME_NAV_BACKGROUND_IMG_FIXED ? 'fixed' : ''
        } header-cover w-full h-[25rem] object-cover object-center`}
      />
      {/* 深色遮罩 */}
      <div className="absolute inset-0 bg-black opacity-10 z-10"></div>

      <div className="text-white absolute bottom-6 flex flex-col h-full items-center justify-center w-full">
        {/* 站点标题 */}
        <div className="text-center font-black text-6xl lg:text-8xl shadow-text">{TITLE}</div>

        {/* 站点欢迎语 */}
        <div className="mt-6 h-12 items-center text-center font-medium shadow-text text-xl lg:text-2xl">
          <span id="typed" ref={typedEl} />
        </div>

        {/* 首页导航大按钮 */}
        {LAWN_HOME_NAV_BUTTONS && <NavButtonGroup {...props} />}

        {/* 开始阅读按钮 */}
        <div
          onClick={scrollToWrapper}
          className="z-30 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-4 text-white"
        >
          <div className="opacity-70 animate-bounce text-xs">
            {LAWN_SHOW_START_READING && locale.COMMON.START_READING}
          </div>
          <i className="opacity-70 animate-bounce fas fa-angle-down" />
        </div>
      </div>

      <WavesArea />
    </div>
  );
};

export default Hero;
