import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'react-notion-x';

import BLOG from '@/blog.config';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { getLayoutByTheme } from '@/themes/theme';

import { formatDateFmt } from '@/libs/common/date';
import { getGlobalData } from '@/libs/notion/getNotionData';

const ArchiveIndex = (props) => {
  const { siteInfo } = props;
  const { locale } = useGlobal();

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() });

  useEffect(() => {
    if (isBrowser) {
      const anchor = window.location.hash;
      if (anchor) {
        setTimeout(() => {
          const anchorElement = document.getElementById(anchor.substring(1));
          if (anchorElement) {
            anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }
        }, 300);
      }
    }
  }, []);

  const meta = {
    title: `${locale.NAV.ARCHIVE} | ${siteConfig('TITLE')}`,
    description: siteConfig('DESCRIPTION'),
    image: siteInfo?.pageCover,
    slug: 'archive',
    type: 'website'
  };

  props = { ...props, meta };

  return <Layout {...props} />;
};

export async function getStaticProps() {
  const props = await getGlobalData({ from: 'archive-index' });
  // 处理分页
  props.posts = props.allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');
  delete props.allPages;

  const postsSortByDate = Object.create(props.posts);

  postsSortByDate.sort((a, b) => {
    return b?.publishDate - a?.publishDate;
  });

  const archivePosts = {};

  postsSortByDate.forEach((post) => {
    const date = formatDateFmt(post.publishDate, 'yyyy');
    if (archivePosts[date]) {
      archivePosts[date].push(post);
    } else {
      archivePosts[date] = [post];
    }
  });

  props.archivePosts = archivePosts;
  delete props.allPages;

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export default ArchiveIndex;
