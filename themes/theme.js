import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import cookie from 'react-cookies';

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
          elements[i].parentNode.removeChild(elements[i])
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

/**
 * 初始化主题 , 优先级 query > cookies > systemPrefer
 * @param isDarkMode
 * @param updateDarkMode 更改主题ChangeState函数
 * @description 读取cookie中存的用户主题
 */
export const initDarkMode = (updateDarkMode) => {
  // 查看用户设备浏览器是否深色模型
  let newDarkMode = isPreferDark();

  // 查看cookie中是否用户强制设置深色模式
  const cookieDarkMode = loadDarkModeFromCookies();
  if (cookieDarkMode) {
    newDarkMode = JSON.parse(cookieDarkMode);
  }

  // url查询条件中是否深色模式
  const queryMode = getQueryVariable('mode');
  if (queryMode) {
    newDarkMode = queryMode === 'dark';
  }

  updateDarkMode(newDarkMode);
  saveDarkModeToCookies(newDarkMode);
  document.getElementsByTagName('html')[0].setAttribute('class', newDarkMode ? 'dark' : 'light');
};

/**
 * 是否优先深色模式
 */
export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') {
    return true;
  }
  if (BLOG.APPEARANCE === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if(BLOG.APPEARANCE === 'time'){
    const date = new Date();
    return BLOG.APPEARANCE_DARK_TIME && (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] || date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]);
  }
  return false;
}

/**
 * 读取深色模式
 * @returns {*}
 */
export const loadDarkModeFromCookies = () => {
  return cookie.load('darkMode');
};

/**
 * 保存深色模式
 * @param newTheme
 */
export const saveDarkModeToCookies = (newTheme) => {
  cookie.save('darkMode', newTheme, { path: '/' });
};

/**
 * 读取默认主题
 */
export const loadThemeFromCookies = () => {
  return cookie.load('theme');
};

/**
 * 保存默认主题
 * @param newTheme
 */
export const saveThemeToCookies = (newTheme) => {
  cookie.save('theme', newTheme, { path: '/' });
};
