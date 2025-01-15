import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug } from '@/libs/common/util';
import { getGlobalData } from '@/libs/notion/site';

/**
 * 标签下的文章列表
 */
const Tag = (props) => {
  const router = useRouter();
  const THEME = siteConfig('THEME');
  const Layout = getLayoutByTheme({ theme: THEME, router: router });
  return <Layout {...props} />;
};

export async function getStaticProps({ params: { tag } }) {
  const from = 'tag-props';
  const props = await getGlobalData({ from });

  // 过滤状态
  props.posts = props.allPages
    ?.filter((page) => page.type === 'Post' && page.status === 'Published')
    .filter((post) => post.tags?.some((rawTag) => formatNameToSlug(rawTag) === tag) ?? false);

  // 处理文章页数
  props.postCount = props.posts.length;

  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE);
  }

  props.tag = tag;
  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export async function getStaticPaths() {
  const from = 'tag-static-path';
  const { tagOptions } = await getGlobalData({ from });
  const tagNames = tagOptions.map((tag) => formatNameToSlug(tag.name));

  return {
    paths: Object.keys(tagNames).map((index) => ({
      params: { tag: tagNames[index] }
    })),
    fallback: true
  };
}

export default Tag;
