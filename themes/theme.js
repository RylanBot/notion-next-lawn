import getConfig from 'next/config';
import dynamic from 'next/dynamic';

import { getQueryParam, getQueryVariable, isBrowser } from '@/lib/utils';
import * as ThemeComponents from '@theme-components';

import BLOG from '@/blog.config';

// 所有主题在next.config.js中扫描
export const { THEMES = [] } = getConfig().publicRuntimeConfig;

/**
 * 加载全局布局
 * @param {*} themeQuery
 */
export const getGlobalLayoutByTheme = (themeQuery) => {
  const layout = getLayoutNameByPath(-1);
  if (themeQuery !== BLOG.THEME) {
    return dynamic(() => import(`@/themes/${themeQuery}`).then(m => m[layout]), { ssr: true });
  } else {
    return ThemeComponents[layout];
  }
};

/**
 * 加载主题文件
 * 如果是
 * @param {*} router
 */
export const getLayoutByTheme = ({ router, theme }) => {
  const themeQuery = getQueryParam(router.asPath, 'theme') || theme;
  const layoutName = getLayoutNameByPath(router.pathname);

  if (themeQuery !== BLOG.THEME) {
    return dynamic(() => import(`@/themes/${themeQuery}`).then(m => {
      setTimeout(() => {
        checkThemeDOM();
      }, 500);
      return m[layoutName];
    }), { ssr: true });
  } else {
    setTimeout(() => {
      checkThemeDOM();
    }, 100);
    return ThemeComponents[layoutName];
  }
};

/**
 * 切换主题时的特殊处理
 */
const checkThemeDOM = () => {
  if (isBrowser) {
    const elements = document.querySelectorAll('[id^="theme-"]');
    if (elements?.length > 1) {
      elements[elements.length - 1].scrollIntoView();
      // 删除前面的元素，只保留最后一个元素
      for (let i = 0; i < elements.length - 1; i++) {
        if (elements[i] && elements[i].parentNode && elements[i].parentNode.contains(elements[i])) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }
    }
  }
};

/**
 * 根据路径 获取对应的layout
 * @param {*} path
 */
export const getLayoutNameByPath = (path) => {
  switch (path) {
    case -1:
      return 'LayoutBase';
    case '/':
      return 'LayoutIndex';
    case '/archive':
      return 'LayoutArchive';
    case '/page/[page]':
    case '/category/[category]':
    case '/category/[category]/page/[page]':
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return 'LayoutPostList';
    case '/search':
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return 'LayoutSearch';
    case '/404':
      return 'Layout404';
    case '/tag':
      return 'LayoutTagIndex';
    case '/category':
      return 'LayoutCategoryIndex';
    default:
      return 'LayoutSlug';
  }
};
