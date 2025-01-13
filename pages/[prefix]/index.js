import { useRouter } from 'next/router';
import { idToUuid } from 'notion-utils';
import { useEffect, useState } from 'react';
import { isBrowser } from 'react-notion-x';

import BLOG from '@/blog.config';
import { uploadDataToAlgolia } from '@/plugins/algolia/update';
import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getNotionPost } from '@/libs/notion';
import { getPostBlocks } from '@/libs/notion/block';
import { getGlobalData } from '@/libs/notion/site';
import { getPageTableOfContents } from '@/libs/notion/toc';

/**
 * 根据 notion 的 slug 访问页面
 * 只解析一级目录例如 /about
 */
const Slug = (props) => {
  const { post } = props;
  const router = useRouter();
  const [reloaded, setReloaded] = useState(false);

  // 文章加载
  useEffect(() => {
    if (!post) {
      const timeout = setTimeout(() => {
        if (isBrowser) {
          const article = document.getElementById('notion-article');
          if (!article && !reloaded) {
            setReloaded(true);
            console.warn('Try to reload: ', router.asPath);
            router.replace(router.asPath);
          } else {
            router.push('/404');
          }
        }
      }, siteConfig('POST_WAITING_TIME_FOR_404') * 1000);

      return () => clearTimeout(timeout);
    }
  }, [post]);

  props = { ...props };
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() });
  return <Layout {...props} />;
};

export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    };
  }

  const from = 'slug-paths';
  const { allPages } = await getGlobalData({ from });
  return {
    paths: allPages
      ?.filter((row) => row.slug.indexOf('/') < 0 && row.type.indexOf('Menu') < 0)
      .map((row) => ({
        params: {
          prefix: row.slug
        }
      })),
    fallback: true
  };
}

export async function getStaticProps({ params: { prefix } }) {
  let fullSlug = prefix.toLowerCase(); //（不区分大小写）统一转小写
  if (JSON.parse(BLOG.PSEUDO_STATIC)) {
    if (!fullSlug.endsWith('.html')) {
      fullSlug += '.html';
    }
  }
  const from = `slug-props-${fullSlug}`;
  const props = await getGlobalData({ from });
  // 在列表内查找文章
  props.post = props?.allPages?.find((p) => {
    return p.slug.toLowerCase() === fullSlug || p.id === idToUuid(fullSlug);
  });

  // 处理非列表内文章的内信息
  if (!props?.post) {
    const pageId = prefix;
    if (pageId.length >= 32) {
      const post = await getNotionPost(pageId);
      props.post = post;
    }
  }
  // 无法获取文章
  if (!props?.post) {
    props.post = null;
    return { props, revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND) };
  }

  // 文章内容加载
  if (!props?.posts?.blockMap) {
    props.post.blockMap = await getPostBlocks(props.post.id, from);
    props.post.content = Object.keys(props.post.blockMap.block);
    props.post.toc = getPageTableOfContents(props.post, props.post.blockMap);
  }

  // 生成全文索引
  if (BLOG.ALGOLIA_APP_ID) {
    uploadDataToAlgolia(props?.post);
  }

  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export default Slug;
