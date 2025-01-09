import Link from 'next/link';

import NotionPage from '@/plugins/notion/NotionPage';

import { siteConfig } from '@/libs/common/config';
import { formatSlugName, isChinese } from '@/libs/common/util';

import TagItemMini from './TagItemMini';

/**
 * 博客列表的文字内容
 */
const BlogPostCardInfo = ({ post, showPreview, showPageCover, showSummary }) => {
  const SUB_PATH = siteConfig('SUB_PATH', '');

  let CATEGORY_SLUG_MAP = {};
  try {
    // 确保 JSON 字符串格式正确
    CATEGORY_SLUG_MAP = JSON.parse(siteConfig('CATEGORY_SLUG_MAP', {}));
  } catch (error) {}

  return (
    <div
      className={`flex flex-col justify-between p-4 ${
        showPageCover && !showPreview ? 'md:w-7/12 w-full md:max-h-64' : 'w-full'
      }`}
    >
      <div>
        {/* 标题 */}
        <Link
          href={`${SUB_PATH}/${post.slug}`}
          passHref
          className={`mb-2 line-clamp-2 replace cursor-pointer text-xl leading-tight font-semibold text-teal-500 hover:text-teal-400 dark:text-teal-400 dark:hover:text-teal-300 ${
            showPreview ? 'text-center' : ''
          }`}
        >
          <span className="menu-link">{post.title}</span>
        </Link>

        {/* 分类 */}
        {post?.category && (
          <div className="flex items-center text-gray-400">
            <Link
              href={`/category/${formatSlugName(post.category)}`}
              passHref
              className="cursor-pointer font-bold text-sm menu-link text-teal-800 dark:text-teal-600 hover:text-teal-700 dark:hover:text-teal-500 transform"
            >
              <i className="fa-regular fa-folder-open mr-2"></i>
              {isChinese ? CATEGORY_SLUG_MAP[post.category] ?? post.category : post.category}
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

      {/* Tags */}
      <div className="flex items-center justify-between">
        {/* 日期 */}
        <div className="font-bold text-xs leading-tight text-gray-500 dark:text-gray-400">
          {/* <i class="fa-regular fa-calendar mr-1"></i> */}
          {post?.publishDay}
          {post.finished_date && <> - {post.finished_date} </>}
        </div>
        <div className="flex flex-wrap items-center justify-end">
          {post.tagItems?.map((tag) => (
            <TagItemMini key={tag.name} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPostCardInfo;
