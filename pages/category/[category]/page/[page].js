import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug } from '@/libs/common/util';
import { getGlobalData } from '@/libs/notion/site';

/**
 * 分类页
 */
export default function Category(props) {
  const router = useRouter();
  const THEME = siteConfig('THEME');
  const Layout = getLayoutByTheme({ theme: THEME, router: router });
  return <Layout {...props} />;
}

export async function getStaticProps({ params: { category, page } }) {
  const from = 'category-page-props';
  let props = await getGlobalData({ from });

  // 过滤状态类型
  props.posts = props.allPages
    ?.filter((page) => page.type === 'Post' && page.status === 'Published')
    .filter((post) => formatNameToSlug(post.category) === category);

  // 处理文章页数
  props.postCount = props.posts.length;
  // 处理分页
  props.posts = props.posts.slice(BLOG.POSTS_PER_PAGE * (page - 1), BLOG.POSTS_PER_PAGE * page);

  delete props.allPages;
  props.page = page;

  props = { ...props, category, page };

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export async function getStaticPaths() {
  const from = 'category-paths';
  const { categoryOptions, allPages } = await getGlobalData({ from });
  const paths = [];

  categoryOptions?.forEach((category) => {
    // 过滤状态类型
    const categoryPosts = allPages
      ?.filter((page) => page.type === 'Post' && page.status === 'Published')
      .filter((post) => post && post.category && post.category.includes(category.name));
    // 处理文章页数
    const postCount = categoryPosts.length;
    const totalPages = Math.ceil(postCount / BLOG.POSTS_PER_PAGE);
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        paths.push({ params: { category: formatNameToSlug(category.name), page: '' + i } });
      }
    }
  });

  return {
    paths,
    fallback: true
  };
}
