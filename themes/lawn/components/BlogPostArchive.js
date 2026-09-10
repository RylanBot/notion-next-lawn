import Link from 'next/link';
import { useState } from 'react';

import clsx from 'clsx';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import { parsePostDate } from './homeFormat';

const EN_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const ZH_MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const formatArchiveMonth = (monthIndex, isChinese = true) => {
  return (isChinese ? ZH_MONTHS : EN_MONTHS)[monthIndex] || '';
};

const formatDay = (dateStr) => {
  const date = parsePostDate(dateStr);
  if (!date) return '';
  return String(date.getDate()).padStart(2, '0');
};

const groupPostsByMonth = (posts = [], isChinese) => {
  const grouped = new Map();

  posts.forEach((post) => {
    const date = parsePostDate(post?.date?.start);
    const month = date ? date.getMonth() : -1;
    if (!grouped.has(month)) grouped.set(month, []);
    grouped.get(month).push(post);
  });

  return [...grouped.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([month, monthPosts]) => ({
      month,
      label: month >= 0 ? formatArchiveMonth(month, isChinese) : '',
      posts: monthPosts
    }));
};

/**
 * 博客每年归档列表
 */
const BlogPostArchive = ({ posts = [], year }) => {
  const POST_SUB_PATH = siteConfig('POST_SUB_PATH');
  const { locale, isChinese } = useGlobal();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const months = groupPostsByMonth(posts, isChinese);

  if (posts?.length === 0) return null;

  return (
    <section
      id={`archive-year-${year}`}
      className="scroll-mt-28 overflow-hidden rounded-lg border border-teal-900/15 bg-stone-50 shadow-sm dark:border-white/10 dark:bg-zinc-900"
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center gap-4 px-6 py-4 text-left md:px-8"
        aria-expanded={!isCollapsed}
      >
        <span className=" text-2xl leading-none text-zinc-900 dark:text-white md:text-3xl">{year}</span>
        <span className="ml-auto text-sm text-stone-500 dark:text-zinc-400">
          {posts.length} {locale.COMMON.POSTS}
        </span>
        <i
          className={clsx(
            'fa-solid fa-chevron-down ml-3 text-sm text-teal-900 transition-transform duration-300 dark:text-white',
            isCollapsed && '-rotate-90'
          )}
        />
      </button>

      <div
        className={clsx(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-teal-900/10 px-6 pb-5 pt-2 dark:border-white/10 md:px-8">
            {months.map((group) => (
              <div key={`${year}-${group.month}`} className="mt-5 first:mt-3">
                {group.label && (
                  <div className="mb-2">
                    <span className="inline-flex w-16 items-center justify-center rounded-full border border-teal-900 bg-teal-700 px-3 py-1 text-xs font-semibold text-white">
                      {group.label}
                    </span>
                  </div>
                )}
                <ul className="relative pl-6">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-3 left-1.5 top-3 -translate-x-1/2 border-l border-dashed border-teal-900/25 dark:border-white/20"
                  />
                  {group.posts.map((post) => (
                    <li key={post.id} className="group relative">
                      <Link href={`/${POST_SUB_PATH}/${post.slug}`} className="flex items-start gap-4 py-2.5 pr-1">
                        <span className="w-6 shrink-0 pt-1 text-xs tracking-wider text-stone-500 dark:text-zinc-400">
                          {formatDay(post.date?.start)}
                        </span>

                        <span className="min-w-0 flex-1 text-lg leading-snug text-zinc-900 transition-colors group-hover:text-teal-700 dark:text-white">
                          {post.title}
                        </span>

                        <i
                          aria-hidden
                          className="fas fa-arrow-right w-0 overflow-hidden text-xs text-teal-700 opacity-0 transition-all duration-300 group-hover:w-3 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPostArchive;
