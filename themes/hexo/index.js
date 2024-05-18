import Link from 'next/link';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef } from 'react';

import { Transition } from '@headlessui/react';

import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';
import { isBrowser } from '@/lib/utils';

import AlgoliaSearchModal from '@/components/AlgoliaSearchModal';
import Comment from '@/components/Comment';
import replaceSearchResult from '@/components/Mark';
import NotionPage from '@/components/NotionPage';
import ShareBar from '@/components/ShareBar';

import ArticleAdjacent from './components/ArticleAdjacent';
import ArticleCopyright from './components/ArticleCopyright';
import { ArticleLock } from './components/ArticleLock';
import ArticleRecommend from './components/ArticleRecommend';
import BlogPostArchive from './components/BlogPostArchive';
import BlogPostListPage from './components/BlogPostListPage';
import BlogPostListScroll from './components/BlogPostListScroll';
import Card from './components/Card';
import Footer from './components/Footer';
import Hero from './components/Hero';
import JumpToCommentButton from './components/JumpToCommentButton';
import PostHeader from './components/PostHeader';
import RightFloatArea from './components/RightFloatArea';
import SearchNav from './components/SearchNav';
import SideRight from './components/SideRight';
import SlotBar from './components/SlotBar';
import TagItemMini from './components/TagItemMini';
import TocDrawer from './components/TocDrawer';
import TocDrawerButton from './components/TocDrawerButton';
import TopNav from './components/TopNav';

import { Style } from './style';

import CONFIG from './config';
export { CONFIG as THEME_CONFIG };

// 主题全局状态
const ThemeGlobalHexo = createContext();
export const useHexoGlobal = () => useContext(ThemeGlobalHexo);

/**
 * 基础布局
 */
export const LayoutBase = props => {
  const { post, children, slotTop, className } = props;
  const { onLoading, fullWidth } = useGlobal();

  const router = useRouter();
  const headerSlot = post
    ? <PostHeader {...props} />
    : (router.route === '/' && siteConfig('HEXO_HOME_BANNER_ENABLE', null, CONFIG)
        ? <Hero {...props} />
        : null);

  const drawerRight = useRef(null);
  const tocRef = isBrowser ? document.getElementById('article-wrapper') : null;

  const floatSlot = <>
    {post?.toc?.length > 1 && <div className="block lg:hidden">
      <TocDrawerButton
        onClick={() => {
          drawerRight?.current?.handleSwitchVisible();
        }}
      />
    </div>}
    <JumpToCommentButton />
  </>;

  // Algolia搜索框
  const searchModal = useRef(null);

  return (
    <ThemeGlobalHexo.Provider value={{ searchModal }}>
      <div id='theme-hexo' className={`${siteConfig('FONT_STYLE')} dark:bg-black scroll-smooth`}>

        {/* 特定主题 CSS */}
        <Style />

        {/* 顶部嵌入 */}
        <Transition
          show={!onLoading}
          appear={true}
          enter="transition ease-in-out duration-700 transform order-first"
          enterFrom="opacity-0 -translate-y-16"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 translate-y-16"
          unmount={false}
        >
          <TopNav {...props} />
          {headerSlot}
        </Transition>

        {/* 主区块 */}
        <main id="wrapper" className={`${siteConfig('HEXO_HOME_BANNER_ENABLE', null, CONFIG) ? '' : 'pt-16'} bg-hexo-background-gray dark:bg-black w-full py-8 md:px-8 lg:px-24 min-h-screen relative`}>
          <div id="container-inner" className={(JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'flex-row-reverse' : '') + ' w-full mx-auto lg:flex lg:space-x-4 justify-center relative z-10'} >
            <div className={`${className || ''} w-full ${fullWidth ? '' : 'max-w-4xl'} h-full overflow-hidden`}>
              <Transition
                show={!onLoading}
                appear={true}
                enter="transition ease-in-out duration-700 transform order-first"
                enterFrom="opacity-0 translate-y-16"
                enterTo="opacity-100"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-16"
                unmount={false}
              >
                {/* 主区上部嵌入 */}
                {slotTop}

                {children}
              </Transition>
            </div>
            {/* 右侧栏 */}
            <SideRight {...props} />
          </div>
        </main>

        <div className='block lg:hidden'>
          <TocDrawer post={post} cRef={drawerRight} targetRef={tocRef} />
        </div>

        {/* 悬浮菜单 */}
        <RightFloatArea floatSlot={floatSlot} />

        {/* 全文搜索 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />

        {/* 页脚 */}
        <Footer title={siteConfig('TITLE')} />
      </div>
    </ThemeGlobalHexo.Provider>
  );
};

/**
 * 首页（博客列表，嵌入一个Hero大图）
 */
export const LayoutIndex = (props) => {
  return <LayoutPostList {...props} className='pt-8' />;
};

/**
 * 博客列表
 */
export const LayoutPostList = (props) => {
  return (
    <div>
      <SlotBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
    </div>
  );
};

/**
 * 搜索
 */
export const LayoutSearch = props => {
  const { keyword } = props;
  const router = useRouter();
  const currentSearch = keyword || router?.query?.s;

  useEffect(() => {
    if (currentSearch) {
      replaceSearchResult({
        doms: document.getElementsByClassName('replace'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      });
    }
  });

  return (
    <div className='pt-8'>
      {!currentSearch
        ? <SearchNav {...props} />
        : <div id="posts-wrapper"> {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}  </div>}
    </div>
  );
};

/**
 * 归档
 */
export const LayoutArchive = (props) => {
  const { archivePosts } = props;
  return <div className='pt-16 mx-2 mb-2'>
    <Card className='w-full'>
      <div className="mb-10 pb-20 bg-white md:p-12 p-3 min-h-full dark:bg-hexo-black-gray">
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogPostArchive
            key={archiveTitle}
            posts={archivePosts[archiveTitle]}
            archiveTitle={archiveTitle}
          />
        ))}
      </div>
    </Card>
  </div>;
};

/**
 * 文章详情
 */
export const LayoutSlug = props => {
  const { post, lock, validPassword } = props;
  return (
    <>
      <div className="article w-full lg:hover:shadow rounded-t-xl lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray lg:border-2 border-teal-600 dark:border-teal-500">
        {lock && <ArticleLock validPassword={validPassword} />}

        {!lock && <div id="article-wrapper" className="overflow-x-auto flex-grow mx-auto md:w-full md:px-5 ">
          <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased overflow-y-hidden" >
            {/* Notion文章主体 */}
            <section className='px-5 justify-center mx-auto max-w-2xl lg:max-w-full'>
              {post && <NotionPage post={post} />}
            </section>

            {/* 分享 */}
            <ShareBar post={post} />
            {post?.type === 'Post' && <>
              <ArticleCopyright {...props} />
              <ArticleRecommend {...props} />
              <ArticleAdjacent {...props} />
            </>}
          </article>

          <div className='pt-4 border-dashed'></div>

          {/* 评论互动 */}
          <div className="duration-200 overflow-x-auto bg-white dark:bg-hexo-black-gray px-3">
            <Comment frontMatter={post} />
          </div>
        </div>
        }
      </div>
    </>
  );
};

/**
 * 404
 */
export const Layout404 = props => {
  return (
    <>
      <div className="text-black w-full h-screen text-center justify-center content-center items-center flex flex-col">
        <div className="dark:text-gray-200">
          <h2 className="inline-block border-r-2 border-gray-500 mr-2 px-3 py-2 align-top">
            Error
          </h2>
          <div className="inline-block text-left h-32 leading-10 items-center">
            <h2 className="m-0 p-0">
              <span className="px-3 border-r-2 border-gray-500">页面不存在</span>
              <span className="px-3 border-r-2 border-gray-500">渲染超时</span>
              <span className="px-3">尝试重新打开</span>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * 分类列表
 */
export const LayoutCategoryIndex = props => {
  const { categoryOptions } = props;
  const { locale } = useGlobal();
  return (
    <div className='pt-16 mx-2 mb-2'>
      <Card className="w-full">
        <div className="dark:text-gray-200 mb-5 mx-3">
          <i className="mr-2 fas fa-th" />  {locale.COMMON.CATEGORY}
        </div>
        <div id="category-list" className="duration-200 flex flex-wrap mx-8">
          {categoryOptions?.map(category => {
            return (
              <Link key={category.name} href={`/category/${category.name}`} passHref legacyBehavior>
                <div className={' duration-300 px-5 cursor-pointer py-2 hover:text-teal-500 dark:hover:text-teal-400'}>
                  <i className="mr-4 fas fa-folder" />  {category.name}({category.count})
                </div>
              </Link>
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
export const LayoutTagIndex = props => {
  const { tagOptions } = props;
  const { locale } = useGlobal();
  return (
    <div className='pt-16 mx-2 mb-2'>
      <Card className='w-full'>
        <div className="dark:text-gray-200 mb-5 ml-4">
          <i className="mr-2 fas fa-tag" /> {locale.COMMON.TAGS}
        </div>
        <div id="tags-list" className="duration-200 flex flex-wrap ml-8">
          {tagOptions.map(tag => <div key={tag.name} className="p-2">
            <TagItemMini key={tag.name} tag={tag} />
          </div>)}
        </div>
      </Card>
    </div>
  );
};
