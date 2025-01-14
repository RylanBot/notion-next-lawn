import Head from 'next/head';
import { useRouter } from 'next/router';

import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

/**
 * 页面的 Head，用于促进 SEO
 */
const GlobalHead = (props) => {
  const { children, siteInfo, post } = props;
  const router = useRouter();

  const META = getSEOMeta(props, router, useGlobal());
  let URL = siteConfig('PATH')?.length ? `${siteConfig('LINK')}/${siteConfig('SUB_PATH', '')}` : siteConfig('LINK');

  let IMAGE;
  if (META) {
    URL = `${URL}/${META.slug}`;
    IMAGE = META.image || '/bg_image.jpg';
  }

  const AUTHOR = siteConfig('AUTHOR');
  const TITLE = META?.title || siteConfig('TITLE');
  const DESCRIPTION = META?.description || `${siteInfo?.description}`;
  const TYPE = META?.type || 'website';
  const LANG = siteConfig('LANG').replace('-', '_'); // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const CATEGORY = META?.category || siteConfig('KEYWORDS'); // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類
  const FAVICON = siteConfig('BLOG_FAVICON');

  // SEO 关键词
  let KEYWORDS = META?.tags || siteConfig('KEYWORDS');
  if (post?.tags && post?.tags?.length > 0) {
    KEYWORDS = post?.tags?.join(',');
  }

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig('SEO_GOOGLE_SITE_VERIFICATION');
  const ANALYTICS_BUSUANZI_ENABLE = JSON.parse(siteConfig('ANALYTICS_BUSUANZI_ENABLE'));

  return (
    <Head>
      <link rel="icon" href={FAVICON} />
      <title>{TITLE}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0" />
      <meta name="robots" content="follow, index" />
      <meta charSet="UTF-8" />
      {SEO_GOOGLE_SITE_VERIFICATION && <meta name="google-site-verification" content={SEO_GOOGLE_SITE_VERIFICATION} />}
      <meta name="keywords" content={KEYWORDS} />
      <meta name="description" content={DESCRIPTION} />
      <meta property="og:locale" content={LANG} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={URL} />
      <meta property="og:image" content={IMAGE} />
      <meta property="og:site_name" content={TITLE} />
      <meta property="og:type" content={TYPE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:title" content={TITLE} />

      {ANALYTICS_BUSUANZI_ENABLE && <meta name="referrer" content="no-referrer-when-downgrade" />}
      {META?.type === 'Post' && (
        <>
          <meta property="article:author" content={AUTHOR} />
          <meta property="article:section" content={CATEGORY} />
        </>
      )}
      {children}
    </Head>
  );
};

/**
 * 获取 SEO 信息
 */
const getSEOMeta = (props, router, global) => {
  const { locale } = global;
  const { post, siteInfo, tag, category, page } = props;
  const keyword = router?.query?.s;

  switch (router.route) {
    case '/':
      return {
        title: `${siteInfo?.title} | ${siteInfo?.description}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      };
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      };
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      };
    case '/category/[category]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      };
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      };
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      };
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      };
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      };
    case '/404':
      return {
        title: `${siteInfo?.title} | 404`,
        image: `${siteInfo?.pageCover}`
      };
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      };
    case '/category':
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'category',
        type: 'website'
      };
    default:
      return {
        title: post ? `${post?.title} | ${siteInfo?.title}` : 'Loading...',
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        category: post?.category?.[0],
        tags: post?.tags
      };
  }
};

export default GlobalHead;
