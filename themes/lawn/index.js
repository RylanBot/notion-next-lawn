import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import AlgoliaSearchModal from '@/plugins/algolia/AlgoliaSearchModal';
import { replaceSearchResult } from '@/plugins/algolia/highlight';
import Comment from '@/plugins/comment';
import NotionPage from '@/plugins/notion/NotionPage';

import {
  ArticleCopyright,
  BlogPostArchive,
  BlogPostListPage,
  BlogPostListScroll,
  ButtonRandomPost,
  Card,
  CatalogDrawer,
  CategoryMini,
  Footer,
  Hero,
  JumpToCommentButton,
  PostHeader,
  RightFloatArea,
  SearchNav,
  SideRight,
  SlotBar,
  TagItemMini,
  TopNav
} from './components';

import { Style } from './style';

import CONFIG from './config';
export { CONFIG as THEME_CONFIG };

const ThemeGlobalLawn = createContext();
export const useLawnGlobal = () => useContext(ThemeGlobalLawn);

/**
 * 基础布局
 */
export const LayoutBase = (props) => {
  const { post, children, slotTop } = props;

  const router = useRouter();
  const { fullWidth } = useGlobal();

  const FONT_STYLE = siteConfig('FONT_STYLE');
  const LAWN_HOME_BANNER_ENABLE = siteConfig('LAWN_HOME_BANNER_ENABLE', null, CONFIG);
  const LAYOUT_SIDEBAR_REVERSE = JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'));

  const [hydrated, setHydrated] = useState(false);
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  const searchModal = useRef(null);

  const headerSlot = post ? (
    <PostHeader {...props} />
  ) : router.route === '/' && LAWN_HOME_BANNER_ENABLE ? (
    <Hero {...props} onLoad={() => setLayoutLoaded(true)} />
  ) : null;

  const floatSlot = useMemo(
    () => (
      <>
        {post?.toc?.length > 1 && <CatalogDrawer toc={post.toc} />}
        <JumpToCommentButton />
        <ButtonRandomPost {...props} />
      </>
    ),
    [post, post?.toc]
  );

  useEffect(() => {
    setHydrated(true);
    if (router.pathname === '/') return;
    setTimeout(() => {
      setLayoutLoaded(true);
    }, 0);
  }, [router]);

  return (
    <ThemeGlobalLawn.Provider value={{ SEARCH_MODAL: searchModal }}>
      <div id="theme-lawn" className={`${FONT_STYLE} dark:bg-black scroll-smooth`}>
        {/* 特定主题 CSS */}
        <Style />

        {hydrated && (
          <div className={layoutLoaded ? null : 'opacity-0'}>
            {/* 顶部嵌入 */}
            <header>
              <TopNav {...props} />
              {headerSlot}
            </header>

            {/* 主区块 */}
            <main
              id="lawn-main-wrapper"
              className={`bg-lawn-background-gray dark:bg-black w-full min-h-screen relative py-8 md:px-40 ${
                post ? '' : '2xl:px-64'
              } ${LAWN_HOME_BANNER_ENABLE ? 'pt-14 max-md:pt-6' : ''}`}
            >
              <div
                className={`w-full mx-auto lg:flex lg:space-x-6 justify-center relative z-10 ${
                  LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-full h-full overflow-hidden pb-12 ${fullWidth ? 'max-w-4xl' : ''}`}>
                  {slotTop}
                  {children}
                </div>
                {/* 右侧栏 */}
                <SideRight {...props} />
              </div>
            </main>

            {/* 悬浮菜单 */}
            <RightFloatArea floatSlot={floatSlot} />

            {/* 全文搜索 */}
            <AlgoliaSearchModal cRef={searchModal} {...props} />

            {/* 页脚 */}
            <Footer />
          </div>
        )}
      </div>
    </ThemeGlobalLawn.Provider>
  );
};

/**
 * 首页（博客列表，嵌入一个Hero大图）
 */
export const LayoutIndex = (props) => {
  return <LayoutPostList {...props} className="pt-8" />;
};

/**
 * 博客列表
 */
export const LayoutPostList = (props) => {
  const POST_LIST = siteConfig('POST_LIST_STYLE') === 'page';
  return (
    <div>
      <SlotBar {...props} />
      {POST_LIST ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
    </div>
  );
};

/**
 * 搜索
 */
export const LayoutSearch = (props) => {
  const { keyword } = props;

  const router = useRouter();
  const { setOnLoading } = useGlobal();
  const POST_LIST = siteConfig('POST_LIST_STYLE') === 'page';

  const currentSearch = keyword || router?.query?.s;

  useEffect(() => {
    setOnLoading(true);

    const performSearch = async () => {
      if (currentSearch) {
        await replaceSearchResult({
          doms: document.getElementsByClassName('replace'),
          search: keyword,
          target: {
            element: 'span',
            className: 'text-red-500'
          }
        });
      }
      setOnLoading(false);
    };

    performSearch();
  }, [currentSearch]);

  return (
    <div className="pt-16">
      {!currentSearch ? (
        <SearchNav {...props} />
      ) : (
        <div id="posts-wrapper">{POST_LIST ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}</div>
      )}
    </div>
  );
};

/**
 * 归档
 */
export const LayoutArchive = (props) => {
  const { posts } = props;

  const groupPostsByYear = (posts) => {
    const groupedPosts = {};

    posts.forEach((post) => {
      const year = new Date(post.date.start).getFullYear().toString();
      if (!groupedPosts[year]) groupedPosts[year] = [];
      groupedPosts[year].push(post);
    });

    return groupedPosts;
  };

  const archivePosts = groupPostsByYear(posts);

  return (
    <div className="pt-16 mx-2 mb-2">
      <Card className="w-full">
        <div className="mb-10 pb-20 bg-white md:p-12 p-3 min-h-full dark:bg-lawn-black-gray">
          {Object.keys(archivePosts)
            .sort((a, b) => b - a)
            .map((year, index) => (
              <BlogPostArchive key={year} posts={archivePosts[year]} year={year} collapsed={index >= 2} />
            ))}
        </div>
      </Card>
    </div>
  );
};

/**
 * 文章详情
 */
export const LayoutSlug = (props) => {
  const { post } = props;

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const topNav = document.querySelector('#lawn-top-nav');
      const notFound = document.querySelector('#lawn-404');

      if (post || notFound) {
        topNav?.classList.remove('hidden');
      } else {
        topNav?.classList.add('hidden');
      }
    });

    observer.observe(document, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [post]);

  return (
    <div className="article w-full lg:hover:shadow rounded-t-xl lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-lawn-black-gray lg:border-2 border-teal-600 dark:border-teal-500">
      <div id="article-wrapper" className="overflow-x-auto flex-grow mx-auto md:w-full md:px-5 ">
        <article itemScope itemType="https://schema.org/Blog" className="subpixel-antialiased overflow-y-hidden">
          {/* 文章主体 */}
          <section className="px-5 justify-center mx-auto max-w-2xl lg:max-w-full">
            {post && <NotionPage post={post} />}
          </section>
          {/* 版权 */}
          {post?.type === 'Post' && <ArticleCopyright {...props} />}
        </article>

        <div className="pt-4 border-dashed"></div>

        {/* 评论互动 */}
        <div className="duration-200 overflow-x-auto bg-white dark:bg-lawn-black-gray px-3">
          <Comment post={post} />
        </div>
      </div>
    </div>
  );
};

/**
 * 404
 */
export const Layout404 = (props) => {
  const { locale, setOnLoading } = useGlobal();

  useEffect(() => {
    setOnLoading(false);
  }, []);

  return (
    <div id="lawn-404" className="w-full h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center items-center dark:text-gray-200 text-xl max-md:text-sm relative -top-8">
        <span className="px-3 border-r-2 font-bold text-gray-600 dark:text-white">Error</span>
        <span className="px-3 flex">
          {locale.COMMON.ERROR_INFO.split(' | ').map((part, index, array) => (
            <React.Fragment key={index}>
              {part}
              {index < array.length - 1 && <span className="border-r-2 text-gray-300 mx-3"></span>}
            </React.Fragment>
          ))}
        </span>
      </div>
    </div>
  );
};

/**
 * 分类列表
 */
export const LayoutCategoryIndex = (props) => {
  const { categoryOptions } = props;
  const { locale } = useGlobal();

  return (
    <div className="pt-16 mx-2 mb-2">
      <Card className="w-full">
        <div className="dark:text-gray-200 mb-2 mx-3">
          <i className="mr-2 fas fa-th" /> {locale.COMMON.CATEGORY}
        </div>
        <div id="category-list" className="duration-200 flex flex-wrap mx-8">
          {categoryOptions?.map((category) => {
            return (
              <CategoryMini
                key={category.name}
                name={category.name}
                count={category.count}
                icon="mr-1 fas fa-folder"
                className="px-5 py-2 hover:text-teal-500 dark:hover:text-teal-400"
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
};

/**
 * 标签列表
 */
export const LayoutTagIndex = (props) => {
  const { tagOptions } = props;
  const { locale } = useGlobal();
  return (
    <div className="pt-16 mx-2 mb-2">
      <Card className="w-full">
        <div className="dark:text-gray-200 mb-2 ml-4">
          <i className="mr-2 fas fa-tag" /> {locale.COMMON.TAGS}
        </div>
        <div id="tags-list" className="duration-200 flex flex-wrap ml-8">
          {tagOptions.map((tag) => (
            <div key={tag.name} className="p-2">
              <TagItemMini key={tag.name} tag={tag} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
