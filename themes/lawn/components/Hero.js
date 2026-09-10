import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import Typed from 'typed.js';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';
import NavButtonGroup from './NavButtonGroup';
import WavesArea from './WavesArea';

/**
 * 首页 Hero
 */
const Hero = ({ onLoad, ...props }) => {
  const { locale, setOnLoading } = useGlobal();

  const TITLE = siteConfig('TITLE');
  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',');
  const LAWN_HOME_NAV_BUTTONS = siteConfig('LAWN_HOME_NAV_BUTTONS', null, CONFIG);
  const LAWN_HOME_START_READING = siteConfig('LAWN_HOME_START_READING', null, CONFIG);

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

  useEffect(() => {
    updateHeaderHeight();
    setShowHero(true);
    setOnLoading(false);
    onLoad?.();

    const typed = new Typed(typedRef.current, {
      strings: GREETING_WORDS,
      loop: true,
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 2400,
      showCursor: false,
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
      className={clsx(
        'relative z-1 w-full overflow-hidden bg-lawn-header',
        'px-6 pb-20 pt-24 md:px-12 md:pb-28 md:pt-32 xl:px-16',
        !showHero && 'opacity-0'
      )}
    >
      <div className="relative z-10 mx-auto flex min-h-36 w-full max-w-screen-2xl flex-col items-start md:min-h-80 lg:min-h-96">
        <div className="max-w-2xl text-zinc-900 dark:text-white">
          <h1 className=" text-5xl leading-none md:text-7xl xl:text-8xl">{TITLE}</h1>
          <div className="mt-5 min-h-6 text-xl font-semibold tracking-widest">
            <span ref={typedRef} />
          </div>
          {LAWN_HOME_NAV_BUTTONS && <NavButtonGroup {...props} />}
        </div>
      </div>

      {LAWN_HOME_START_READING && (
        <div
          className="relative z-10 mt-6 cursor-pointer text-center text-teal-900 dark:text-white md:mt-10"
          onClick={scrollToWrapper}
        >
          <div className="animate-bounce text-xs opacity-70">{locale.COMMON.START_READING}</div>
          <i className="fas fa-angle-down animate-bounce opacity-70" />
        </div>
      )}

      <WavesArea lightColor="var(--lawn-bg)" darkColor="var(--lawn-bg)" />
    </div>
  );
};

export default Hero;
