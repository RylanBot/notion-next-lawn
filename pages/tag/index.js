import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/site';

/**
 * 标签首页
 */
const TagIndex = (props) => {
  const router = useRouter();
  const THEME = siteConfig('THEME');
  const Layout = getLayoutByTheme({ theme: THEME, router: router });
  return <Layout {...props} />
};

export async function getStaticProps() {
  const from = 'tag-index-props';
  const props = await getGlobalData({ from });
  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export default TagIndex;
