import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { useGlobal } from '@/hooks/useGlobal'
import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'

import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'

import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import { ArticleLock } from './components/ArticleLock'
import ArticleRecommend from './components/ArticleRecommend'
import BlogPostArchive from './components/BlogPostArchive'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import ButtonRandomPost from './components/ButtonRandomPost'
import Card from './components/Card'
import Footer from './components/Footer'
import Hero from './components/Hero'
import JumpToCommentButton from './components/JumpToCommentButton'
import PostHeader from './components/PostHeader'
import RightFloatArea from './components/RightFloatArea'
import SearchNav from './components/SearchNav'
import SideRight from './components/SideRight'
import SlotBar from './components/SlotBar'
import TagItemMini from './components/TagItemMini'
import TocDrawer from './components/TocDrawer'
import TocDrawerButton from './components/TocDrawerButton'
import TopNav from './components/TopNav'

import { Style } from './style'

import CONFIG from './config'
export { CONFIG as THEME_CONFIG }

const ThemeGlobalHexo = createContext()
export const useHexoGlobal = () => useContext(ThemeGlobalHexo)

/**
 * 基础布局
 */
export const LayoutBase = props => {
  const { post, children, slotTop, className } = props

  const router = useRouter()
  const { fullWidth } = useGlobal()

  const TITLE = siteConfig('TITLE')
  const FONT_STYLE = siteConfig('FONT_STYLE')
  const HEXO_HOME_BANNER_ENABLE = siteConfig(    'HEXO_HOME_BANNER_ENABLE',  null, CONFIG)
  const LAYOUT_SIDEBAR_REVERSE = JSON.parse( siteConfig('LAYOUT_SIDEBAR_REVERSE'))

  const headerSlot = post ? (
    <PostHeader {...props} />
  ) : router.route === '/' && HEXO_HOME_BANNER_ENABLE ? (
    <Hero {...props} />
  ) : null

  const [SHOW_NAV, SET_SHOW_NAV] = useState(false)

  const drawerRight = useRef(null)
  const searchModal = useRef(null)

  const tocRef = isBrowser ? document.getElementById('article-wrapper') : null

  const floatSlot = (
    <>
      {post?.toc?.length > 1 && (
        <>
          <TocDrawerButton
            onClick={() => drawerRight?.current?.handleSwitchVisible()}
          />
          <TocDrawer post={post} cRef={drawerRight} targetRef={tocRef} />
        </>
      )}
      <JumpToCommentButton />
      <ButtonRandomPost {...props} />
    </>
  )

  useEffect(() => {
    if (router.pathname === '/') {
      setTimeout(() => {
        SET_SHOW_NAV(true)
      }, 300)
    } else {
      SET_SHOW_NAV(true)
    }
  }, [router.pathname])

  return (
    <ThemeGlobalHexo.Provider value={{ SEARCH_MODAL: searchModal }}>
      <div id="theme-hexo"
        className={`${FONT_STYLE} dark:bg-black scroll-smooth`}
      >
        {/* 特定主题 CSS */}
        <Style />

        {/* 顶部嵌入 */}
        <header>
          {SHOW_NAV && <TopNav {...props} />}
          {headerSlot}
        </header>

        {/* 主区块 */}
        <main className={`${HEXO_HOME_BANNER_ENABLE && 'pt-16'}
         bg-hexo-background-gray dark:bg-black w-full py-8 md:px-8 lg:px-24 min-h-screen relative`}
         >
          <div className={`${LAYOUT_SIDEBAR_REVERSE && 'flex-row-reverse'} w-full mx-auto lg:flex lg:space-x-4 justify-center relative z-10`}>
            <div className={`${className} w-full ${fullWidth && 'max-w-4xl'} h-full overflow-hidden`}>
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
        <Footer title={TITLE} />
      </div>
    </ThemeGlobalHexo.Provider>
  )
}

/**
 * 首页（博客列表，嵌入一个Hero大图）
 */
export const LayoutIndex = props => {
  return <LayoutPostList {...props} className="pt-8" />
}

/**
 * 博客列表
 */
export const LayoutPostList = props => {
  return (
    <div>
      <SlotBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}

/**
 * 搜索
 */
export const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

  useEffect(() => {
    if (currentSearch) {
      replaceSearchResult({
        doms: document.getElementsByClassName('replace'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  })

  return (
    <div className="pt-8">
      {!currentSearch ? (
        <SearchNav {...props} />
      ) : (
        <div id="posts-wrapper">
          {' '}
          {siteConfig('POST_LIST_STYLE') === 'page' ? (
            <BlogPostListPage {...props} />
          ) : (
            <BlogPostListScroll {...props} />
          )}{' '}
        </div>
      )}
    </div>
  )
}

/**
 * 归档
 */
export const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <div className="pt-16 mx-2 mb-2">
      <Card className="w-full">
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
    </div>
  )
}

/**
 * 文章详情
 */
export const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  return (
    <>
      <div className="article w-full lg:hover:shadow rounded-t-xl lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray lg:border-2 border-teal-600 dark:border-teal-500">
        {lock && <ArticleLock validPassword={validPassword} />}

        {!lock && (
          <div
            id="article-wrapper"
            className="overflow-x-auto flex-grow mx-auto md:w-full md:px-5 "
          >
            <article
              itemScope
              itemType="https://schema.org/Movie"
              className="subpixel-antialiased overflow-y-hidden"
            >
              {/* Notion文章主体 */}
              <section className="px-5 justify-center mx-auto max-w-2xl lg:max-w-full">
                {post && <NotionPage post={post} />}
              </section>

              {/* 分享 */}
              <ShareBar post={post} />
              {post?.type === 'Post' && (
                <>
                  <ArticleCopyright {...props} />
                  <ArticleRecommend {...props} />
                  <ArticleAdjacent {...props} />
                </>
              )}
            </article>

            <div className="pt-4 border-dashed"></div>

            {/* 评论互动 */}
            <div className="duration-200 overflow-x-auto bg-white dark:bg-hexo-black-gray px-3">
              <Comment frontMatter={post} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * 404
 */
export const Layout404 = props => {
  const router = useRouter()
  const [from, setFrom] = useState(null)

  useEffect(() => {
    if (router.query.from) {
      setFrom(router.query.from)
    }
  }, [router.query.from])

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <div className="flex justify-center items-center dark:text-white">
        <span className="px-3 border-r-2">Error</span>
        <span className="px-3 border-r-2">页面不存在</span>
        <span className="px-3 border-r-2">渲染超时</span>
        <span className="px-3">尝试重新打开</span>
      </div>
      {from && (
        <i
          onClick={() => router.replace(from)}
          className="cursor-pointer fa-solid fa-arrows-rotate mx-2 my-6 p-2 rounded-full bg-teal-400 hover:bg-teal-500 text-white"
        ></i>
      )}
    </div>
  )
}

/**
 * 分类列表
 */
export const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  return (
    <div className="pt-16 mx-2 mb-2">
      <Card className="w-full">
        <div className="dark:text-gray-200 mb-5 mx-3">
          <i className="mr-2 fas fa-th" /> {locale.COMMON.CATEGORY}
        </div>
        <div id="category-list" className="duration-200 flex flex-wrap mx-8">
          {categoryOptions?.map(category => {
            return (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior
              >
                <div
                  className={
                    ' duration-300 px-5 cursor-pointer py-2 hover:text-teal-500 dark:hover:text-teal-400'
                  }
                >
                  <i className="mr-4 fas fa-folder" /> {category.name}(
                  {category.count})
                </div>
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

/**
 * 标签列表
 */
export const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()
  return (
    <div className="pt-16 mx-2 mb-2">
      <Card className="w-full">
        <div className="dark:text-gray-200 mb-5 ml-4">
          <i className="mr-2 fas fa-tag" /> {locale.COMMON.TAGS}
        </div>
        <div id="tags-list" className="duration-200 flex flex-wrap ml-8">
          {tagOptions.map(tag => (
            <div key={tag.name} className="p-2">
              <TagItemMini key={tag.name} tag={tag} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
