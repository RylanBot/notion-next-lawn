import throttle from 'lodash.throttle';
import { useCallback, useEffect, useState } from 'react';

import FloatDarkModeButton from './FloatDarkModeButton';
// import FloatLangSwitchButton from './FloatLangSwitchButton';
import JumpToTopButton from './JumpToTopButton';

/**
 * 右下角悬浮按钮
 */
const FloatRightArea = ({ floatSlot }) => {
  const [showFloatButton, switchShow] = useState(false);

  const scrollListener = useCallback(
    throttle(() => {
      const targetRef = document.getElementById('lawn-main-wrapper');
      if (!targetRef) return;

      const clientHeight = targetRef.clientHeight;
      const scrollY = window.scrollY;
      const fullHeight = clientHeight - window.innerHeight;
      const per = Math.min(100, (scrollY / fullHeight) * 100);

      const shouldShow = scrollY > 100 && per > 0;
      if (shouldShow !== showFloatButton) {
        switchShow(shouldShow);
      }
    }, 200),
    [showFloatButton]
  );

  useEffect(() => {
    document.addEventListener('scroll', scrollListener);
    return () => document.removeEventListener('scroll', scrollListener);
  }, [scrollListener]);

  return (
    <div
      className={`duration-300 transition-all bottom-16 right-1 fixed justify-end z-20 rounded-sm text-white bg-teal-500 dark:bg-teal-600 p-2 lg:scale-125 lg:mr-2 ${
        showFloatButton ? 'opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div className="justify-center flex flex-col items-center cursor-pointer space-y-2">
        <FloatDarkModeButton />
        {/* <FloatLangSwitchButton /> */}
        {floatSlot}
        <JumpToTopButton />
      </div>
    </div>
  );
};

export default FloatRightArea;
