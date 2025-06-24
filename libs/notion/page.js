import { idToUuid } from 'notion-utils';

import { getLastPartOfUrl } from '../common/util';

export const getAllPageIds = (collectionQuery, collectionId, collectionView, viewIds) => {
  if (!collectionQuery && !collectionView) {
    return [];
  }
  // 优先按照第一个视图排序
  let pageIds = [];
  try {
    if (viewIds && viewIds.length > 0) {
      const ids = collectionQuery[collectionId][viewIds[0]]?.collection_group_results?.blockIds;
      for (const id of ids) {
        pageIds.push(id);
      }
    }
  } catch (error) {}

  // 否则按照数据库原始排序
  if (pageIds.length === 0 && collectionQuery && Object.values(collectionQuery).length > 0) {
    const pageSet = new Set();
    Object.values(collectionQuery[collectionId]).forEach((view) => {
      view?.blockIds?.forEach((id) => pageSet.add(id)); // group视图
      view?.collection_group_results?.blockIds?.forEach((id) => pageSet.add(id)); // table视图
    });
    pageIds = [...pageSet];
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  }
  return pageIds;
};

/**
 * 将 id 映射成博文内部链接（去除连字符）
 */
export const mapPageUrl = (id) => {
  return '/' + id.replace(/-/g, '');
};

/**
 * 处理页面内的链接跳转
 */
export const handleInternalUrls = (allPages, subPath) => {
  // 引用其它 Notion 文章
  const notionLinks = document?.getElementById('notion-article')?.querySelectorAll('a.notion-link');
  if (!notionLinks) return;

  notionLinks.forEach((link) => {
    const hrefUuid = idToUuid(getLastPartOfUrl(link.href));
    const matchedPage = allPages.find((page) => hrefUuid.includes(page.id));
    if (matchedPage) {
      link.href = `/${matchedPage.slug}`;
    }
  });

  const url = window.location.pathname;
  const prefix = url.split('/')[1];
  if (prefix !== subPath) return;

  // 子页面跟随父页面的 slug
  const notionPageLinks = document?.getElementById('notion-article')?.querySelectorAll('a.notion-page-link');
  notionPageLinks.forEach((link) => {
    link.href = `${window.location.pathname}/${getLastPartOfUrl(link.href)}`;
  });
};
