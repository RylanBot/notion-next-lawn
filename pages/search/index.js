import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/site';

/**
 * 搜索路由
 */
const Search = props => {
  const { posts } = props;
  const router = useRouter();
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: router });

  const keyword = getSearchKey(router);

  let filteredPosts;
  // 静态过滤
  if (keyword) {
    filteredPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : '';
      const categoryContent = post.category ? post.category.join(' ') : '';
      const searchContent =
        post.title + post.summary + tagContent + categoryContent;
      return searchContent.toLowerCase().includes(keyword.toLowerCase());
    });
  } else {
    filteredPosts = [];
  }

  return <Layout {...props} />;
};

/**
 * 浏览器前端搜索
 */
export async function getStaticProps() {
  const props = await getGlobalData({
    from: 'search-props',
    pageType: ['Post']
  });
  const { allPages } = props;
  props.posts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published');
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

function getSearchKey(router) {
  if (router.query && router.query.s) {
    return router.query.s;
  }
  return null;
}

export default Search;
