import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/site';

export default function Category(props) {
  const router = useRouter();

  const THEME = siteConfig('THEME');
  const Layout = getLayoutByTheme({ theme: THEME, router: router });

  return <Layout {...props} />;
}

export async function getStaticProps({ params: { category } }) {
  const from = 'category-props';
  let props = await getGlobalData({ from });

  // 过滤状态
  props.posts = props.allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');
  // 处理过滤
  props.posts = props.posts.filter((post) => post && post.category && post.category.includes(category));
  // 处理文章页数
  props.postCount = props.posts.length;
  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE);
  }

  delete props.allPages;

  props = { ...props, category };

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export async function getStaticPaths() {
  const from = 'category-paths';
  const { categoryOptions } = await getGlobalData({ from });
  return {
    paths: Object.keys(categoryOptions).map((category) => ({
      params: { category: categoryOptions[category]?.name }
    })),
    fallback: true
  };
}
