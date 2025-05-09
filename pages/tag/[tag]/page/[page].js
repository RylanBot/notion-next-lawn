import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug } from '@/libs/common/util';
import { getGlobalData } from '@/libs/notion/site';

const Tag = (props) => {
  const router = useRouter();
  const THEME = siteConfig('THEME');
  const Layout = getLayoutByTheme({ theme: THEME, router: router });
  return <Layout {...props} />;
};

export async function getStaticProps({ params: { tag, page } }) {
  const from = 'tag-page-props';
  const props = await getGlobalData({ from });
  // 过滤状态
  props.posts = props.allPages
    ?.filter((page) => page.type === 'Post' && page.status === 'Published')
    .filter((post) => post.tags?.some((rawTag) => formatNameToSlug(rawTag) === tag) ?? false);
 
    // 处理文章数
  props.postCount = props.posts.length;
  // 处理分页
  props.posts = props.posts.slice(BLOG.POSTS_PER_PAGE * (page - 1), BLOG.POSTS_PER_PAGE * page);

  props.tag = tag;
  props.page = page;
  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export async function getStaticPaths() {
  const from = 'tag-page-static-path';
  const { tagOptions, allPages } = await getGlobalData({ from });
  const paths = [];
  tagOptions?.forEach((tag) => {
    // 过滤状态类型
    const tagPosts = allPages
      ?.filter((page) => page.type === 'Post' && page.status === 'Published')
      .filter((post) => post && post?.tags && post?.tags.includes(tag.name));
    // 处理文章页数
    const postCount = tagPosts.length;
    const totalPages = Math.ceil(postCount / BLOG.POSTS_PER_PAGE);
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        paths.push({ params: { tag: formatNameToSlug(tag.name), page: '' + i } });
      }
    }
  });
  return {
    paths: paths,
    fallback: true
  };
}

export default Tag;
