import Link from 'next/link';

import clsx from 'clsx';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, safeJSONParse } from '@/libs/common/util';

import { parsePostDate } from './homeFormat';
import InfoCard from './InfoCard';

const notionBackgroundClass = (color) => {
  const name = color && color !== 'default' ? color : 'gray';
  return `notion-${name}_background`;
};

const groupArchiveYears = (pages = []) => {
  const grouped = {};

  pages.forEach((page) => {
    const date = parsePostDate(page?.date?.start);
    if (!date) return;
    const year = date.getFullYear();
    if (!grouped[year]) {
      grouped[year] = { year, count: 0, latestMonth: date.getMonth() };
    }
    grouped[year].count += 1;
    if (date.getMonth() > grouped[year].latestMonth) {
      grouped[year].latestMonth = date.getMonth();
    }
  });

  return Object.values(grouped)
    .sort((a, b) => b.year - a.year)
    .slice(0, 4);
};

const HomeLivingIndex = ({ allNavPages = [], ...props }) => {
  const { locale, isChinese, tagOptions, categoryOptions } = useGlobal();
  const TAG_SLUG_MAP = safeJSONParse(siteConfig('TAG_SLUG_MAP', {}));
  const CATEGORY_SLUG_MAP = safeJSONParse(siteConfig('CATEGORY_SLUG_MAP', {}));

  const tags = (tagOptions || []).slice(0, siteConfig('PREVIEW_TAG_COUNT') || 16);
  const previewCategoryCount = siteConfig('PREVIEW_CATEGORY_COUNT');
  const categories =
    previewCategoryCount > 0 ? (categoryOptions || []).slice(0, previewCategoryCount) : categoryOptions || [];
  const archiveYears = groupArchiveYears(allNavPages);
  const showTagField = categories.length > 0 || tags.length > 0;

  const displayTagName = (name) => (isChinese ? (TAG_SLUG_MAP[name] ?? name) : name);
  const displayCategoryName = (name) => (isChinese ? (CATEGORY_SLUG_MAP[name] ?? name) : name);

  return (
    <section
      id="home-living-index"
      className="relative w-full overflow-x-hidden bg-lawn-bg px-6 pb-12 pt-8 md:px-12 md:pb-14 md:pt-10 xl:px-16"
    >
      <div className="pointer-events-none absolute -left-10 bottom-4 h-24 w-24 rounded-full bg-emerald-400 opacity-20 dark:opacity-10 md:h-60 md:w-60" />
      <div className="pointer-events-none absolute -right-10 bottom-4 h-40 w-40 rounded-full bg-teal-400 opacity-20 dark:opacity-10 md:h-60 md:w-60" />

      <div className="relative mx-auto max-w-screen-2xl">
        <div className="mt-6 flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-12">
          <InfoCard className="w-full max-w-sm shrink-0" {...props} />

          <div className="flex min-w-0 flex-1 flex-col gap-12">
            {showTagField && (
              <div className="lawn-tag-field rounded-xl border border-teal-800 bg-stone-50 px-6 py-8 shadow-lg dark:border-teal-400/40 dark:bg-zinc-900 md:px-8">
                <div className="flex flex-col gap-4">
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={`/category/${formatNameToSlug(category.name)}`}
                          className={clsx(
                            'lawn-tag-chip inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-900',
                            notionBackgroundClass(category.color)
                          )}
                        >
                          <i aria-hidden className="fas fa-folder text-sm" />
                          {displayCategoryName(category.name)}
                        </Link>
                      ))}
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {tags.map((tag) => (
                        <Link
                          key={tag.name}
                          href={`/tag/${formatNameToSlug(tag.name)}`}
                          className={clsx(
                            'lawn-tag-chip inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-900',
                            notionBackgroundClass(tag.color)
                          )}
                        >
                          <i aria-hidden className="fas fa-hashtag text-sm" />
                          {displayTagName(tag.name)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {archiveYears.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <div className="lawn-archive-rail pointer-events-none absolute left-[5px] right-[5px] top-[4.5px]" />
                  <div className="relative flex">
                    {archiveYears.map((item, index) => {
                      const isFirst = index === 0;
                      const isLast = index === archiveYears.length - 1;
                      return (
                        <Link
                          key={item.year}
                          href={`/archive#archive-year-${item.year}`}
                          className={clsx(
                            'group flex min-w-0 flex-1 flex-col gap-1.5',
                            archiveYears.length === 1 && 'items-center',
                            archiveYears.length > 1 && isFirst && 'items-start',
                            archiveYears.length > 1 && isLast && 'items-end',
                            archiveYears.length > 1 && !isFirst && !isLast && 'items-center'
                          )}
                        >
                          <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-teal-900 dark:bg-teal-400" />
                          <span className="text-xl leading-tight text-teal-900 group-hover:text-teal-700 dark:text-white sm:text-2xl md:text-3xl">
                            {item.year}
                          </span>
                          <span className="whitespace-nowrap text-sm text-stone-500 dark:text-zinc-400">
                            <span className="tabular-nums">{item.count}</span>
                            {isChinese ? '' : ' '}
                            {locale.COMMON.POSTS}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeLivingIndex;
