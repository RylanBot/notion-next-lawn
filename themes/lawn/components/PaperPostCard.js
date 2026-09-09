import Link from 'next/link';
import { useRouter } from 'next/router';

import clsx from 'clsx';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, safeJSONParse } from '@/libs/common/util';
import LazyImage from '@/plugins/base/LazyImage';

import CONFIG from '../config';
import { formatSlashDate } from './homeFormat';

const useCategoryLabel = (name) => {
  const { isChinese } = useGlobal();
  const CATEGORY_SLUG_MAP = safeJSONParse(siteConfig('CATEGORY_SLUG_MAP', {}));
  if (!name) return '';
  return isChinese ? (CATEGORY_SLUG_MAP[name] ?? name) : name;
};

const PaperPostCard = ({ post, siteInfo, postPath, priority = false, rotate }) => {
  const router = useRouter();
  const { isChinese } = useGlobal();

  const categoryLabel = useCategoryLabel(post.category);

  const TAG_SLUG_MAP = safeJSONParse(siteConfig('TAG_SLUG_MAP', {}));
  const LAWN_POST_LIST_COVER = siteConfig('LAWN_POST_LIST_COVER', null, CONFIG);

  const cover =
    post?.pageCoverThumbnail || (siteConfig('LAWN_POST_LIST_COVER_DEFAULT', null, CONFIG) ? siteInfo?.pageCover : '');

  const tags = post.tagItems?.length ? post.tagItems : (post.tags || []).map((name) => ({ name, color: 'gray' }));

  const handleCardClick = (e) => {
    if (e.target.closest('a')) return;
    router.push(`/${postPath}/${post.slug}`);
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
        'group flex h-full cursor-pointer flex-col gap-4 rounded border border-teal-900 bg-stone-50 p-6 text-zinc-900 shadow-lg transition-transform duration-300 dark:border-white/20 dark:bg-zinc-900 dark:text-white',
        rotate || 'hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-center justify-between text-xs tracking-wider text-teal-900 dark:text-teal-100">
        <span>{categoryLabel}</span>
        <span>{formatSlashDate(post.date?.start)}</span>
      </div>
      <div className="h-px w-full bg-teal-900 opacity-40 dark:bg-white" />
      {LAWN_POST_LIST_COVER && cover && (
        <div className="relative h-40 w-full overflow-hidden rounded">
          <LazyImage
            priority={priority}
            src={cover}
            alt={post.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <h3 className="line-clamp-3 text-xl font-medium leading-tight text-zinc-900 dark:text-white md:text-2xl">
        {post.title}
      </h3>
      {post.summary && (
        <p className="line-clamp-2 text-base leading-relaxed text-teal-900 dark:text-teal-100">{post.summary}</p>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-2">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {tags.map((tag) => {
            const name = isChinese ? (TAG_SLUG_MAP[tag.name] ?? tag.name) : tag.name;
            return (
              <Link
                key={tag.name}
                href={`/tag/${formatNameToSlug(tag.name)}`}
                className="max-w-full truncate rounded border border-teal-900/40 bg-stone-50/90 px-1.5 py-0.5 text-xs leading-4 text-zinc-900 dark:border-white/30 dark:bg-zinc-800 dark:text-white"
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaperPostCard;
