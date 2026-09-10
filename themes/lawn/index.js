import clsx from 'clsx';

import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import AlgoliaSearchModal from '@/plugins/algolia/AlgoliaSearchModal';
import { TravellingsModal, TravellingsProvider } from '@/plugins/base/TravellingsLink';
import Comment from '@/plugins/comment';
import NotionPage from '@/plugins/notion/NotionPage';

import {
  ArticleCopyright,
  Card,
  Catalog,
  CatalogDrawer,
  CategoryMini,
  FloatRightArea,
  Footer,
  Hero,
  HomeEditorial,
  HomeLivingIndex,
  JumpToCommentButton,
  PaperArchive,
  PostHeader,
  PostList,
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
  const { post, children } = props;

  const router = useRouter();

  const FONT_STYLE = siteConfig('FONT_STYLE');
  const LAWN_HOME_BANNER_ENABLE = siteConfig('LAWN_HOME_BANNER_ENABLE', null, CONFIG);

  const searchModal = useRef(null);
  const [layoutLoaded, setLayoutLoaded] = useState(false);

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
        {/* <FloatRandomPostButton {...props} /> */}
      </>
    ),
    [post, post?.toc]
  );

  useEffect(() => {
    if (router.pathname === '/') return;
    setTimeout(() => {
      setLayoutLoaded(true);
    }, 0);
  }, [router]);

  return (
    <ThemeGlobalLawn.Provider value={{ searchModal }}>
      <TravellingsProvider>
        <div id="theme-lawn" className={clsx('scroll-smooth bg-lawn-bg', FONT_STYLE, !layoutLoaded && 'opacity-0')}>
          {/* 特定主题 CSS */}
          <Style />

          {/* 顶部嵌入 */}
          <header>
            <TopNav {...props} />
            {headerSlot}
          </header>

          {/* 主区块 */}
          <main id="lawn-main-wrapper" className="relative z-10 min-h-screen w-full bg-lawn-bg">
            {children}
          </main>

          {/* 悬浮菜单 */}
          <FloatRightArea floatSlot={floatSlot} />

          {/* 全文搜索 */}
          <AlgoliaSearchModal cRef={searchModal} {...props} />

          {/* Travellings 弹窗 */}
          <TravellingsModal />

          {/* 页脚 */}
          <Footer />
        </div>
      </TravellingsProvider>
    </ThemeGlobalLawn.Provider>
  );
};

/**
 * 首页
 */
export const LayoutIndex = (props) => {
  return (
    <>
      <HomeLivingIndex {...props} />
      <HomeEditorial {...props} />
    </>
  );
};

/**
 * 博客列表
 */
export const LayoutPostList = (props) => {
  return <PostList {...props} />;
};

/**
 * 归档
 */
export const LayoutArchive = (props) => {
  return <PaperArchive {...props} />;
};

/**
 * 文章详情
 */
export const LayoutSlug = (props) => {
  const { post } = props;
  const hasToc = post?.toc?.length > 1;

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
    <div className="lawn-article-page min-h-screen w-full px-4 md:px-16 pb-16">
      <div className="mx-auto flex max-w-8xl justify-center gap-12 md:pt-16">
        <div className="w-full">
          <div
            id="lawn-article-wrapper"
            className="rounded-lg border-2 border-teal-900 bg-lawn-bg pb-10 px-6 shadow-lg dark:border-white/25 md:px-10"
          >
            <article
              itemScope
              itemType="https://schema.org/Blog"
              className="overflow-x-hidden text-black dark:text-white"
            >
              {post && <NotionPage post={post} />}
              {post?.type === 'Post' && <ArticleCopyright {...props} />}
            </article>
          </div>

          {post && (
            <>
              <div className="mt-12 overflow-x-auto">
                <Comment post={post} />
              </div>
            </>
          )}
        </div>

        {hasToc && (
          <aside className="hidden w-56 shrink-0 xl:block">
            <div className="sticky top-24">
              <Catalog toc={post.toc} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

/**
 * 404
 */
export const Layout404 = () => {
  const { locale, setOnLoading } = useGlobal();

  useEffect(() => {
    setOnLoading(false);
  }, []);

  return (
    <div id="lawn-404" className="w-full h-screen flex flex-col justify-center items-center">
      <div className="flex justify-center items-center dark:text-gray-200 text-2xl max-md:text-sm relative -top-8">
        <span className="px-4 border-r-2 font-bold text-gray-600 dark:text-white">404</span>
        <span className="px-4 flex">{locale.COMMON.ERROR_INFO}</span>
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
        <div className="duration-200 flex flex-wrap mx-8">
          {categoryOptions?.map((category) => {
            return (
              <CategoryMini
                key={category.name}
                name={category.name}
                count={category.count}
                icon="mr-1 fas fa-folder"
                className="px-5 py-2 hover:text-teal-500 dark:hover:text-teal-500"
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
        <div className="duration-200 flex flex-wrap ml-8">
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
