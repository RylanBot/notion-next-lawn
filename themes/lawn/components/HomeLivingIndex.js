import Link from 'next/link';

import clsx from 'clsx';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, safeJSONParse } from '@/libs/common/util';

import { padCount, parsePostDate } from './homeFormat';

const TAG_SIZES = ['text-xl', 'text-sm', 'text-sm', 'text-sm', 'text-xl', 'text-sm'];

const CATEGORY_SLOTS = [
  { top: '42%', left: '1%', rotate: 'rotate-3' },
  { top: '68%', left: '15%', rotate: 'rotate-6' },
  { top: '51%', left: '71%', rotate: '-rotate-3' },
  { top: '8%', left: '60%', rotate: 'rotate-6' },
  { top: '14%', left: '6%', rotate: '-rotate-6' },
  { top: '80%', left: '52%', rotate: 'rotate-2' }
];

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

const HomeLivingIndex = ({ allNavPages = [] }) => {
  const { locale, isChinese, tagOptions, categoryOptions } = useGlobal();
  const TAG_SLUG_MAP = safeJSONParse(siteConfig('TAG_SLUG_MAP', {}));
  const CATEGORY_SLUG_MAP = safeJSONParse(siteConfig('CATEGORY_SLUG_MAP', {}));

  const tags = (tagOptions || []).slice(0, siteConfig('PREVIEW_TAG_COUNT') || 16);
  const categories = (categoryOptions || []).slice(0, 6);
  const outerCategories = categories.length <= 4 ? categories : categories.slice(0, Math.ceil(categories.length / 2));
  const innerCategories = categories.length <= 4 ? [] : categories.slice(outerCategories.length);
  const archiveYears = groupArchiveYears(allNavPages);

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
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="flex max-w-2xl items-center gap-3  text-2xl leading-none text-zinc-900 dark:text-white md:text-4xl">
            <span aria-hidden className="inline-block h-3 w-1.5 shrink-0 rounded-sm bg-teal-700 md:h-4 md:w-2" />
            全站总览
          </h2>
        </header>

        <div className="mt-6 grid grid-cols-1 items-start gap-8 xl:grid-cols-2 xl:gap-6">
          <div className="relative flex w-full items-center justify-center md:min-h-80">
            <div className="md:hidden flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <CategoryChip
                  key={category.name}
                  name={displayCategoryName(category.name)}
                  slug={formatNameToSlug(category.name)}
                  count={category.count}
                  className={clsx(
                    notionBackgroundClass(category.color),
                    CATEGORY_SLOTS[index % CATEGORY_SLOTS.length].rotate
                  )}
                />
              ))}
            </div>

            <div className="relative hidden aspect-[5/4] w-full max-w-md md:block">
              <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-7/12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 opacity-30 dark:opacity-15" />

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-11/12 -translate-x-1/2 -translate-y-1/2">
                <div className="lawn-orbit-ring lawn-orbit-ring-outer relative h-full w-full border border-teal-900 opacity-40 dark:border-white" />
              </div>

              {outerCategories.map((category, index) => (
                <CategoryChip
                  key={category.name}
                  name={displayCategoryName(category.name)}
                  slug={formatNameToSlug(category.name)}
                  count={category.count}
                  className={clsx('lawn-orbit-sat lawn-orbit-sat-outer', notionBackgroundClass(category.color))}
                  style={{
                    '--orbit-start': `${(index / Math.max(outerCategories.length, 1)) * 100}%`
                  }}
                />
              ))}
              {innerCategories.map((category, index) => (
                <CategoryChip
                  key={category.name}
                  name={displayCategoryName(category.name)}
                  slug={formatNameToSlug(category.name)}
                  count={category.count}
                  className={clsx('lawn-orbit-sat lawn-orbit-sat-inner', notionBackgroundClass(category.color))}
                  style={{
                    '--orbit-start': `${(index / Math.max(innerCategories.length, 1)) * 100 + 12}%`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-24">
            {tags.length > 0 && (
              <div className="lawn-tag-field -rotate-1 rounded-3xl border border-teal-800 bg-stone-50 px-6 py-8 shadow-lg dark:border-teal-400/40 dark:bg-zinc-900 md:px-8">
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag, index) => (
                    <Link
                      key={tag.name}
                      href={`/tag/${formatNameToSlug(tag.name)}`}
                      className={clsx(
                        'lawn-tag-chip rounded px-2.5 py-1.5 font-medium leading-6 text-zinc-900 dark:text-zinc-900',
                        notionBackgroundClass(tag.color),
                        TAG_SIZES[index % TAG_SIZES.length]
                      )}
                    >
                      {`#${displayTagName(tag.name)}`}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {archiveYears.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <div className="lawn-archive-rail pointer-events-none absolute left-1.5 right-1.5 top-1.5" />
                  <div className="relative flex justify-between gap-3 overflow-x-auto">
                    {archiveYears.map((item, index) => (
                      <Link
                        key={item.year}
                        href={`/archive#archive-year-${item.year}`}
                        className={clsx(
                          'group flex min-w-24 flex-col gap-1.5',
                          index === 0 && 'items-start',
                          index === archiveYears.length - 1 && 'items-end',
                          index !== 0 && index !== archiveYears.length - 1 && 'items-center'
                        )}
                      >
                        <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-teal-900 dark:bg-teal-400" />
                        <span className=" text-3xl leading-tight text-teal-900 group-hover:text-teal-700 dark:text-white">
                          {item.year}
                        </span>
                        <span className="text-sm text-stone-500 dark:text-zinc-400">
                          {item.count} {locale.HOME.ARCHIVE_COUNT}
                        </span>
                      </Link>
                    ))}
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

const CategoryChip = ({ name, slug, count, className, style }) => (
  <Link
    href={`/category/${slug}`}
    style={style}
    className={clsx(
      'inline-flex items-center gap-2.5 rounded-full border border-zinc-900 px-4 py-2 text-zinc-900 shadow-lg dark:border-zinc-900 dark:text-zinc-900',
      !String(className || '').includes('lawn-orbit-sat') && 'transition-transform hover:scale-105',
      className
    )}
  >
    <span className="text-base font-medium">{name}</span>
    <span className="text-xs font-bold">{padCount(count)}</span>
  </Link>
);

export default HomeLivingIndex;
