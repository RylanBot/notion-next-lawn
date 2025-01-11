import { useEffect } from 'react';
import { isBrowser } from 'react-notion-x';

import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { isMobile } from '@/libs/common/util';

const Live2D = () => {
  const { theme, switchTheme } = useGlobal();
  const SHOW_PET = JSON.parse(siteConfig('WIDGET_PET'));
  const PET_LINK = siteConfig('WIDGET_PET_LINK');

  useEffect(() => {
    if(!isBrowser) return;

    const script = document.createElement('script');
    script.src = '/js/live2d.min.js';
    script.onload = () => {
      try {
        if (typeof window?.loadlive2d !== 'undefined') {
          loadlive2d('live2d', PET_LINK);
        }
      } catch (error) {
        console.warn('读取 PET 模型失败:', error);
      }
    };
    script.onerror = () => {
      console.error('无法加载脚本 /live2d.min.js');
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [theme, isBrowser]);

  function handleClick() {
    if (JSON.parse(siteConfig('WIDGET_PET_SWITCH_THEME'))) {
      switchTheme();
    }
  }

  if ((!SHOW_PET) || isMobile()) return <></>;

  return (
    <canvas
      id="live2d"
      width="250"
      height="250"
      onClick={handleClick}
      className="cursor-grab pl-8 pt-20"
      onMouseDown={(e) => e.target.classList.add('cursor-grabbing')}
      onMouseUp={(e) => e.target.classList.remove('cursor-grabbing')}
    />
  );
};

export default Live2D;
