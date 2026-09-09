import Link from 'next/link';

import clsx from 'clsx';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, safeJSONParse } from '@/libs/common/util';

import BlogPostListEmpty from './BlogPostListEmpty';
import PaginationNumber from './PaginationNumber';
import PaperPostCard from './PaperPostCard';

/**
 * 分类 / 标签 / 分页列表：纸质筛选条 + 三列卡片
 */
const PaperPostList = ({ page = 1, posts = [], postCount, siteInfo, tag, category }) => {
  const { locale, isChinese, categoryOptions = [], tagOptions = [] } = useGlobal();
  const POST_SUB_PATH = siteConfig('POST_SUB_PATH');
  const POSTS_PER_PAGE = parseInt(siteConfig('POSTS_PER_PAGE'));
  const TAG_SLUG_MAP = safeJSONParse(siteConfig('TAG_SLUG_MAP', {}));
  const CATEGORY_SLUG_MAP = safeJSONParse(siteConfig('CATEGORY_SLUG_MAP', {}));

  const isTag = Boolean(tag);
  const isCategory = Boolean(category);
  const totalPage = Math.ceil((postCount || 0) / POSTS_PER_PAGE);
  const showPagination = (postCount || 0) >= POSTS_PER_PAGE;

  const displayCategory = (name) => (isChinese ? (CATEGORY_SLUG_MAP[name] ?? name) : name);
  const displayTag = (name) => (isChinese ? (TAG_SLUG_MAP[name] ?? name) : name);

  const currentCategory = categoryOptions.find((item) => formatNameToSlug(item.name) === category);
  const currentTag = tagOptions.find((item) => formatNameToSlug(item.name) === tag);

  const heading = isTag
    ? `#${displayTag(currentTag?.name || tag)}`
    : isCategory
      ? displayCategory(currentCategory?.name || category)
      : locale.COMMON.LATEST_POSTS;

  const count = String(postCount || 0);

  const tagLimit = siteConfig('PREVIEW_TAG_COUNT') || 16;
  const visibleTags = (() => {
    if (!isTag) return [];
    const current = tagOptions.find((item) => formatNameToSlug(item.name) === tag);
    const rest = tagOptions.filter((item) => formatNameToSlug(item.name) !== tag);
    return current ? [current, ...rest].slice(0, tagLimit) : rest.slice(0, tagLimit);
  })();

  const pills = isTag
    ? visibleTags.map((item) => ({
        key: item.name,
        href: `/tag/${formatNameToSlug(item.name)}`,
        label: displayTag(item.name),
        count: item.count,
        active: formatNameToSlug(item.name) === tag
      }))
    : categoryOptions.map((item) => ({
        key: item.name,
        href: `/category/${formatNameToSlug(item.name)}`,
        label: displayCategory(item.name),
        count: item.count,
        active: formatNameToSlug(item.name) === category
      }));

  return (
    <section className="w-full bg-lawn-bg px-6 pb-16 pt-24 text-zinc-900 dark:text-white md:px-12 md:pb-24 md:pt-28 xl:px-16">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-10 md:gap-12">
        {pills.length > 0 && (
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            {pills.map((pill) => (
              <Link
                key={pill.key}
                href={pill.href}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs tracking-wider transition-colors',
                  pill.active
                    ? 'pointer-events-none border-teal-900 bg-teal-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                    : 'border-teal-900/20 bg-white text-teal-900 hover:border-teal-900 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:border-white'
                )}
              >
                <span className="font-semibold uppercase">{pill.label}</span>
                <span
                  className={clsx(
                    'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs',
                    pill.active ? 'bg-white/20 dark:bg-zinc-900/10' : 'bg-teal-900/10 dark:bg-white/10'
                  )}
                >
                  {pill.count}
                </span>
              </Link>
            ))}
          </div>
        )}

        <header className="flex flex-col gap-3">
          <h1 className="flex items-center gap-3  text-3xl leading-none text-zinc-900 dark:text-white md:text-5xl">
            <span aria-hidden className="inline-block h-3 w-1.5 shrink-0 rounded-sm bg-teal-700 md:h-4 md:w-2" />
            {heading}
          </h1>
        </header>

        {!posts?.length ? (
          <BlogPostListEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 xl:gap-10">
            {posts.map((post, index) => (
              <PaperPostCard
                key={post.id}
                post={post}
                siteInfo={siteInfo}
                postPath={POST_SUB_PATH}
                priority={index === 0}
              />
            ))}
          </div>
        )}

        {showPagination && <PaginationNumber page={page} totalPage={totalPage} />}
      </div>
    </section>
  );
};

export default PaperPostList;
