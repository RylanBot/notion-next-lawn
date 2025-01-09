import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/site';
import { getPostBlocks } from '@/libs/notion/block';
import { generateRobotsTxt } from '@/libs/subscribe/robots.txt';
import { generateRss } from '@/libs/subscribe/rss';

const Index = (props) => {
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() });
  return <Layout {...props} />;
};

export async function getStaticProps() {
  const from = 'index';
  const props = await getGlobalData({ from });

  props.posts = props.allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');

  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE);
  }

  // 预览文章内容
  if (BLOG.POST_LIST_PREVIEW === 'true') {
    for (const i in props.posts) {
      const post = props.posts[i];
      if (post.password && post.password !== '') {
        continue;
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', BLOG.POST_PREVIEW_LINES);
    }
  }

  // 生成robotTxt
  generateRobotsTxt();
  // 生成Feed订阅
  if (JSON.parse(BLOG.ENABLE_RSS)) {
    generateRss(props?.latestPosts || []);
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages;

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export default Index;
