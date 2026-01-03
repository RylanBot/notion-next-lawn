import { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import LazyImage from '@/plugins/base/LazyImage';

import CONFIG from '../config';
import NavButtonGroup from './NavButtonGroup';
import WavesArea from './WavesArea';

/**
 * 首页大图
 */
const Hero = ({ onLoad, ...props }) => {
  const { siteInfo } = props;
  const { locale, setOnLoading } = useGlobal();

  const TITLE = siteConfig('TITLE');
  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',');
  const LAWN_HOME_NAV_BUTTONS = siteConfig('LAWN_HOME_NAV_BUTTONS', null, CONFIG);
  const LAWN_HOME_START_READING = siteConfig('LAWN_HOME_START_READING', null, CONFIG);
  const LAWN_HOME_NAV_BACKGROUND_IMG_FIXED = siteConfig('LAWN_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG);

  const typedRef = useRef(null);
  const wrapperTopRef = useRef(0);
  const [showHero, setShowHero] = useState(false);

  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTopRef.current, behavior: 'smooth' });
  };

  const updateHeaderHeight = () => {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('lawn-main-wrapper');
      wrapperTopRef.current = wrapperElement?.offsetTop;
    });
  };

  const handleCoverLoaded = () => {
    setTimeout(() => {
      setShowHero(true);
      setOnLoading(false);
      onLoad();
    }, 1500);
  };

  useEffect(() => {
    setOnLoading(true);

    updateHeaderHeight();

    const typed = new Typed(typedRef.current, {
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
      className={`relative flex flex-col justify-center items-center bg-white z-1 w-full h-[30rem] ${
        showHero ? '' : 'opacity-0'
      }`}
    >
      <LazyImage
        className={`brightness-75 w-full h-[30rem] object-cover object-center ${
          LAWN_HOME_NAV_BACKGROUND_IMG_FIXED ? 'fixed' : ''
        }`}
        src={siteInfo?.pageCover}
        priority={true}
        fetchpriority="high"
        onLoad={handleCoverLoaded}
      />

      <div className="text-gray-200 absolute flex flex-col h-full items-center justify-center w-full">
        {/* 站点标题 */}
        <div className="font-times shadow-text text-center text-7xl lg:text-9xl z-10">{TITLE}</div>

        {/* 站点欢迎语 */}
        <div className="mt-6 h-12 items-center text-center font-bold text-xl lg:text-2xl z-10">
          <span ref={typedRef} />
        </div>

        {/* 首页导航大按钮 */}
        {LAWN_HOME_NAV_BUTTONS && <NavButtonGroup {...props} />}

        {/* 开始阅读按钮 */}
        {LAWN_HOME_START_READING && (
          <div
            className="z-10 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-4 text-white"
            onClick={scrollToWrapper}
          >
            <div className="opacity-70 animate-bounce text-xs">{locale.COMMON.START_READING}</div>
            <i className="opacity-70 animate-bounce fas fa-angle-down" />
          </div>
        )}
      </div>

      <WavesArea />
    </div>
  );
};

export default Hero;
