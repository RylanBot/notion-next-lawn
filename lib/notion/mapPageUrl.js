import { idToUuid } from 'notion-utils';
import { getLastPartOfUrl, isBrowser } from '../utils';

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
  const allAnchorTags = document?.getElementById('notion-article')?.querySelectorAll('a.notion-link');
  if (!allAnchorTags) return;

  allAnchorTags.forEach(anchorTag => {
    const hrefUuid = idToUuid(getLastPartOfUrl(anchorTag.href));
    const matchedPage = allPages.find(page => hrefUuid.includes(page.id));
    if (matchedPage) {
      anchorTag.href = `/${matchedPage.slug}`;
    }
  });
};
