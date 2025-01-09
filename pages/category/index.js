import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/site';

/**
 * 分类首页
 */
export default function Category(props) {
  const router = useRouter();
  const THEME = siteConfig('THEME');
  const Layout = getLayoutByTheme({ theme: THEME, router: router });
  return <Layout {...props} />
}

export async function getStaticProps() {
  const props = await getGlobalData({ from: 'category-index-props' });
  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}
