import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/site';

const ArchiveIndex = (props) => {
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() });
  return <Layout {...props} />;
};

export async function getStaticProps() {
  const props = await getGlobalData({ from: 'archive-index' });
  props.posts = props.allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');
  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export default ArchiveIndex;
