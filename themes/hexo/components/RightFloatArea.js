import { useCallback, useEffect, useState } from 'react'

import throttle from 'lodash.throttle'
import FloatDarkModeButton from './FloatDarkModeButton'
import JumpToTopButton from './JumpToTopButton'

/**
 * 悬浮在右下角的按钮，当页面向下滚动100px时会出现
 * @param {*} param0
 * @returns
 */
export default function RightFloatArea({ floatSlot }) {

  // 右下角显示悬浮按钮
  const [showFloatButton, switchShow] = useState(false)
  const scrollListener = useCallback(throttle(() => {
    const targetRef = document.getElementById('wrapper')
    if (!targetRef) return;

    const clientHeight = targetRef.clientHeight;
    const scrollY = window.scrollY;
    const fullHeight = clientHeight - window.innerHeight;
    let per = Math.min(100, (scrollY / fullHeight) * 100);

    const shouldShow = scrollY > 100 && per > 0;
    if (shouldShow !== showFloatButton) {
      switchShow(shouldShow);
    }
  }, 200), [showFloatButton]);

  useEffect(() => {
    document.addEventListener('scroll', scrollListener);
    return () => document.removeEventListener('scroll', scrollListener);
  }, [scrollListener]);

  return (
    <div className={`${showFloatButton ? 'opacity-100' : 'invisible opacity-0'} duration-300 transition-all bottom-12 right-1 fixed justify-end z-20 text-white bg-teal-500 dark:bg-hexo-black-gray rounded-sm`}>
      <div className={'justify-center flex flex-col items-center cursor-pointer'}>

        <FloatDarkModeButton />

        {floatSlot}

        <JumpToTopButton />

      </div>
    </div >
  )
}
