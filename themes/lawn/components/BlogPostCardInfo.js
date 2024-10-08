import Link from 'next/link';

import NotionPage from '@/components/NotionPage';
import { siteConfig } from '@/lib/config';

import TagItemMini from './TagItemMini';

/**
 * 博客列表的文字内容
 */
export const BlogPostCardInfo = ({ post, showPreview, showPageCover, showSummary }) => {
  return (
    <div
      className={`flex flex-col justify-between lg:p-6 p-4 ${
        showPageCover && !showPreview ? 'md:w-7/12 w-full md:max-h-64' : 'w-full'
      }`}
    >
      <div>
        {/* 标题 */}
        <Link
          href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
          passHref
          className={`line-clamp-2 replace cursor-pointer text-xl leading-tight font-semibold text-teal-500 hover:text-teal-400 dark:text-teal-400 dark:hover:text-teal-300 ${
            showPreview ? 'text-center' : ''
          }`}
        >
          <span className="menu-link">{post.title}</span>
        </Link>

        {/* 分类 */}
        {post?.category && (
          <div
            className={`flex mt-2 items-center flex-wrap dark:text-gray-500 text-gray-400 ${
              showPreview ? 'justify-center' : 'justify-start'
            }`}
          >
            <Link
              href={`/category/${post.category}`}
              passHref
              className="cursor-pointer font-light text-sm menu-link hover:text-teal-500 dark:hover:text-teal-400 transform"
            >
              <i className="mr-1 far fa-folder" />
              {post.category}
            </Link>
          </div>
        )}

        {/* 摘要 */}
        {(!showPreview || showSummary) && !post.results && (
          <p className="line-clamp-2 replace my-3 text-gray-700 dark:text-gray-300 text-sm font-light leading-5">
            {post.summary}
          </p>
        )}

        {/* 搜索结果 */}
        {post.results && (
          <p className="line-clamp-2 mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-5">
            {post.results.map((r, index) => (
              <span key={index}>{r}</span>
            ))}
          </p>
        )}
        {/* 预览 */}
        {showPreview && (
          <div className="overflow-ellipsis truncate">
            <NotionPage post={post} />
          </div>
        )}
      </div>

      <div>
        <div className="text-gray-400 justify-between flex">
          {/* 日期 */}
          {/* <Link
                    href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                    passHref
                    className="font-light menu-link cursor-pointer text-sm leading-4 mr-3">
                    <i className="far fa-calendar-alt mr-1" />
                    {post?.publishDay || post.lastEditedDay}
                </Link> */}
          <span className="font-light text-sm leading-7 mr-3">
            <i className="far fa-calendar-alt mr-1" />
            {post?.publishDay}
            {post.finished_date && <> - {post.finished_date} </>}
          </span>

          {/* Tag */}
          <div className="md:flex-nowrap flex-wrap md:justify-start inline-block">
            <div>
              {post.tagItems?.map((tag) => (
                <TagItemMini key={tag.name} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
