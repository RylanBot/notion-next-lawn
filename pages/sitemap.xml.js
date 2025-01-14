import { getServerSideSitemap } from 'next-sitemap';

import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/site';

export const getServerSideProps = async (ctx) => {
  const { allPages } = await getGlobalData({ from: 'rss' });
  const LINK = siteConfig('LINK');
  const POST_SUB_PATH = siteConfig('POST_SUB_PATH');

  // 默认
  const defaultFields = [
    {
      loc: `${LINK}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${LINK}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${LINK}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7'
    },
    {
      loc: `${LINK}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7'
    }
  ];

  // 补充文章
  const postFields = allPages
    ?.filter((p) => p.status === 'Published')
    ?.map((post) => {
      const slug = post.slug.startsWith('/') ? post?.slug?.slice(1) : `${POST_SUB_PATH}/${post.slug}`;
      const date = (post.date.end ? post.date.end : post.date.start).replace(/\//g, '-');
      return {
        loc: `${LINK}/${slug}`,
        lastmod: date,
        changefreq: 'weekly',
        priority: post?.type === 'Menu' ? '0.9' : '0.8'
      };
    })
    .sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod));

  const fields = defaultFields.concat(postFields);
  fields.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));

  // 缓存
  ctx.res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=59');

  return getServerSideSitemap(ctx, fields);
};

export default () => {};
