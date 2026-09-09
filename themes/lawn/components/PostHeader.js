import Link from 'next/link';

import LazyImage from '@/plugins/base/LazyImage';
import WordCount from '@/plugins/base/WordCount';
import NotionIcon from '@/plugins/notion/NotionIcon';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, safeJSONParse } from '@/libs/common/util';

import CategoryMini from './CategoryMini';
import { formatSlashDate } from './homeFormat';

/**
 * 文章头部
 */
export default function PostHeader({ post, siteInfo }) {
  const { locale, isChinese } = useGlobal();
  const TAG_SLUG_MAP = safeJSONParse(siteConfig('TAG_SLUG_MAP', {}));

  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover;
  const published = post.date?.start ? formatSlashDate(post.date.start) : '';
  const updated = post.date?.end ? formatSlashDate(post.date.end) : '';

  if (!post) return;

  return (
    <div id="lawn-header" className="relative z-10 w-full overflow-hidden bg-lawn-header">
      {headerImage && (
        <LazyImage
          priority
          key={headerImage}
          src={headerImage}
          className="lawn-header-cover absolute inset-0 h-full w-full object-cover object-center opacity-10"
        />
      )}
      <div className="lawn-header-fade pointer-events-none absolute inset-x-0 bottom-0 h-32" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-24 pt-28 text-center md:px-4 md:pb-28 md:pt-32">
        {post.category && (
          <CategoryMini
            name={post.category}
            className="mb-4 inline-flex rounded-full border border-zinc-900/40 bg-white/80 px-3 py-1 text-md font-semibold tracking-wider text-zinc-900 transition-colors hover:border-teal-700 hover:text-teal-700 dark:border-white/30 dark:bg-zinc-800 dark:text-white dark:hover:border-teal-400 dark:hover:text-teal-500"
          />
        )}

        <h1 className="flex items-center justify-center gap-2 font-bold text-3xl leading-tight text-zinc-900 dark:text-white md:text-5xl">
          <NotionIcon icon={post.pageIcon} className="text-3xl md:text-4xl" />
          <span>{post.title}</span>
        </h1>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-900 dark:text-white">
          {post.type !== 'Page' && published && (
            <span className="inline-flex items-center gap-1.5">
              <i className="fas fa-hourglass-half text-xs" />
              <span>
                {locale.COMMON.POST_TIME}: {published}
              </span>
            </span>
          )}
          {updated && (
            <span className="inline-flex items-center gap-1.5">
              <i className="far fa-calendar-check text-xs" />
              <span>
                {locale.COMMON.LAST_EDITED_TIME}: {updated}
              </span>
            </span>
          )}
          <WordCount />
        </div>

        {post.tagItems?.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {post.tagItems.map((tag) => {
              const name = isChinese ? (TAG_SLUG_MAP[tag.name] ?? tag.name) : tag.name;
              return (
                <Link
                  key={tag.name}
                  href={`/tag/${formatNameToSlug(tag.name)}`}
                  className="max-w-full truncate rounded border border-zinc-900/40 bg-white/80 px-1.5 py-0.5 text-xs leading-4 text-zinc-900 transition-colors hover:border-teal-700 hover:text-teal-700 dark:border-white/30 dark:bg-zinc-800 dark:text-white dark:hover:border-teal-400 dark:hover:text-teal-500"
                >
                  {name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
