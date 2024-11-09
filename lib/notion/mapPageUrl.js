import { idToUuid } from 'notion-utils';
import { getLastPartOfUrl, isBrowser } from '../utils';

import BLOG from '@/blog.config';

/**
 * 将 id 映射成博文内部链接（去除连字符）
 */
export const mapPageUrl = (id) => {
  return '/' + id.replace(/-/g, '');
};

/**
 * 处理页面内的链接跳转
 */
export const handleInternalUrls = (allPages) => {
  if (!isBrowser) return;

  // 引用其它 Notion 文章
  const notionLinks = document?.getElementById('notion-article')?.querySelectorAll('a.notion-link');
  if (!notionLinks) return;

  notionLinks.forEach(link => {
    const hrefUuid = idToUuid(getLastPartOfUrl(link.href));
    const matchedPage = allPages.find(page => hrefUuid.includes(page.id));
    if (matchedPage) {
      link.href = `/${matchedPage.slug}`;
    }
  });

  const url = window.location.pathname;
  const prefix = url.split('/')[1];
  if (prefix !== BLOG.POST_URL_PREFIX) return;
  // 子页面跟随父页面的 slug
  const notionPageLinks = document?.getElementById('notion-article')?.querySelectorAll('a.notion-page-link');
  notionPageLinks.forEach(link => {
    link.href = `${window.location.pathname}/${getLastPartOfUrl(link.href)}`;
  });
};
