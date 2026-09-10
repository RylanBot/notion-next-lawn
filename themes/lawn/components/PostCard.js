import Link from 'next/link';
import { useRouter } from 'next/router';

import clsx from 'clsx';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, safeJSONParse } from '@/libs/common/util';
import LazyImage from '@/plugins/base/LazyImage';

import { formatSlashDate } from './homeFormat';

const useCategoryLabel = (name) => {
  const { isChinese } = useGlobal();
  const CATEGORY_SLUG_MAP = safeJSONParse(siteConfig('CATEGORY_SLUG_MAP', {}));
  if (!name) return '';
  return isChinese ? (CATEGORY_SLUG_MAP[name] ?? name) : name;
};

const PostCard = ({ post, priority = false }) => {
  const router = useRouter();
  const { isChinese } = useGlobal();

  const categoryLabel = useCategoryLabel(post.category);

  const POST_PATH = siteConfig('POST_SUB_PATH');
  const TAG_SLUG_MAP = safeJSONParse(siteConfig('TAG_SLUG_MAP', {}));
  const thumbnail = post?.thumbnail || post?.pageCoverThumbnail;

  const tags = post.tagItems?.length ? post.tagItems : (post.tags || []).map((name) => ({ name, color: 'gray' }));

  const handleCardClick = (e) => {
    if (e.target.closest('a')) return;
    router.push(`/${POST_PATH}/${post.slug}`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick(e);
      }}
      className={clsx(
        'group relative flex h-full cursor-pointer flex-col overflow-hidden rounded border border-teal-900 bg-stone-50 text-zinc-900 shadow-lg transition-transform duration-300 dark:border-white/20 dark:bg-zinc-900 dark:text-white'
      )}
    >
      {thumbnail && (
        <div className="lawn-card-wash pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <LazyImage
            src={thumbnail}
            alt=""
            className="lawn-card-wash-img absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      )}

      {thumbnail && (
        <div className="lawn-card-cover relative h-44 w-full shrink-0 overflow-hidden">
          <LazyImage
            priority={priority}
            src={thumbnail}
            alt=""
            className="lawn-card-cover-img h-full w-full object-cover object-center"
          />
        </div>
      )}

      <div className="relative flex h-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between text-xs tracking-wider text-zinc-600 dark:text-zinc-100">
          <span>{categoryLabel}</span>
          <span>{formatSlashDate(post.date?.start)}</span>
        </div>
        <div className="h-px w-full bg-zinc-900/25 dark:bg-white/30" />
        <h3 className="line-clamp-3 text-xl font-medium leading-tight text-zinc-900 dark:text-white md:text-2xl">
          {post.title}
        </h3>
        {post.summary && (
          <p className="line-clamp-2 text-base leading-relaxed text-zinc-700 dark:text-zinc-200">{post.summary}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {tags.map((tag) => {
              const name = isChinese ? (TAG_SLUG_MAP[tag.name] ?? tag.name) : tag.name;
              return (
                <Link
                  key={tag.name}
                  href={`/tag/${formatNameToSlug(tag.name)}`}
                  className="max-w-full truncate rounded border border-zinc-900/30 bg-white/45 px-1.5 py-0.5 text-xs leading-4 text-zinc-800 dark:border-white/30 dark:bg-white/10 dark:text-zinc-100"
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
