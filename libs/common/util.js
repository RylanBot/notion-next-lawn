import { isBrowser } from 'react-notion-x';

/**
 * 单词 -> 连字符
 */
export const formatNameToSlug = (name) => name.replace(/\s+/g, '-').toLowerCase();

/**
 * 连字符 -> 单词
 */
export const formatSlugToName = (slug) => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const isChinese = isBrowser && navigator.language.startsWith('zh');

/**
 * Google 机器人
 */
export const isSearchEngineBot = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }
  // 获取用户代理字符串
  const userAgent = navigator.userAgent;
  // 使用正则表达式检测是否包含搜索引擎爬虫关键字
  return /Googlebot|bingbot|Baidu/.test(userAgent);
};

/**
 * 判断是否移动设备
 */
export const isMobile = (() => {
  if (!isBrowser) return false;

  // 这个判断会引发 TypeError: navigator.userAgentData.mobile is undefined 问题，导致博客无法正常工作
  // if (navigator.userAgentData?.mobile) {
  //   return true;
  // }

  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    return true;
  }

  if (/Android|iPhone|iPad|iPod/i.test(navigator.platform)) {
    return true;
  }

  return false;
})();

// 转换外链
export function sliceUrlFromHttp(str) {
  // 检查字符串是否包含http
  if (str?.includes('http:') || str?.includes('https:')) {
    // 如果包含，找到http的位置
    const index = str?.indexOf('http');
    // 返回http之后的部分
    return str.slice(index, str.length);
  } else {
    // 如果不包含，返回原字符串
    return str;
  }
}

// 截取 url 中最后一个 / 后面的内容
export function getLastPartOfUrl(url) {
  if (!url) return '';

  // 找到最后一个斜杠的位置
  const lastSlashIndex = url.lastIndexOf('/');

  // 如果找不到斜杠，则返回整个字符串
  if (lastSlashIndex === -1) return url;

  // 截取最后一个斜杠后面的内容
  const lastPart = url.substring(lastSlashIndex + 1);

  return lastPart;
}

/**
 * 加载外部资源
 * @param url 地址 例如 https://xx.com/xx.js
 * @param type js 或 css
 */
export function loadExternalResource(url, type) {
  const attribute = type === 'js' ? 'src' : 'href';
  const elements = document.querySelectorAll(`[${attribute}='${url}']`);

  return new Promise((resolve, reject) => {
    if (elements.length > 0 || !url) {
      resolve(url);
      return url;
    }

    let tag;

    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    } else if (type === 'font') {
      tag = document.createElement('link');
      tag.rel = 'preload';
      tag.as = 'font';
      tag.href = url;
    } else if (type === 'js') {
      tag = document.createElement('script');
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => {
        resolve(url);
      };
      tag.onerror = () => {
        console.log('Load Error', url);
        reject(url);
      };
      document.head.appendChild(tag);
    }
  });
}

/**
 * 查询 URL 中的 query 参数
 */
export function getQueryVariable(key) {
  const query = isBrowser ? window.location.search.substring(1) : '';
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === key) {
      return pair[1];
    }
  }
  return false;
}

/**
 * 获取 URL 中指定参数的值
 */
export function getQueryParam(url, param) {
  // 移除哈希部分
  const urlWithoutHash = url.split('#')[0];
  const searchParams = new URLSearchParams(urlWithoutHash.split('?')[1]);
  return searchParams.get(param);
}

/**
 * 深度合并两个对象
 * @param target
 * @param sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}

/**
 * 是否可迭代
 */
export function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

/**
 * 深拷贝对象
 * 根据源对象类型深度复制，支持object和array
 */
export function deepClone(obj) {
  if (Array.isArray(obj)) {
    // If obj is an array, create a new array and deep clone each element
    return obj.map((item) => deepClone(item));
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (obj[key] instanceof Date) {
          newObj[key] = new Date(obj[key].getTime()).toISOString();
        } else {
          newObj[key] = deepClone(obj[key]);
        }
      }
    }
    return newObj;
  } else {
    return obj;
  }
}

/**
 * 延时
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
