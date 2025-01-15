import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getPostBlocks } from '@/libs/notion/block';
import { getGlobalData } from '@/libs/notion/site';

/**
 * 文章分页
 */
export default function Page(props) {
  const router = useRouter();
  const THEME = siteConfig('THEME');
  const Layout = getLayoutByTheme({ theme: THEME, router: router });
  return <Layout {...props} />;
}

export async function getStaticPaths() {
  const from = 'page-paths';
  const { postCount } = await getGlobalData({ from });
  const totalPages = Math.ceil(postCount / BLOG.POSTS_PER_PAGE);
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  };
}

export async function getStaticProps({ params: { page } }) {
  const from = `page-${page}`;
  const props = await getGlobalData({ from });
  const { allPages } = props;
  const allPosts = allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');
  // 处理分页
  props.posts = allPosts.slice(BLOG.POSTS_PER_PAGE * (page - 1), BLOG.POSTS_PER_PAGE * page);
  props.page = page;

  // 处理预览
  if (BLOG.POST_LIST_PREVIEW === 'true') {
    for (const i in props.posts) {
      const post = props.posts[i];
      if (post.password && post.password !== '') {
        continue;
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', BLOG.POST_PREVIEW_LINES);
    }
  }

  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}
