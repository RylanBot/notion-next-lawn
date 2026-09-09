import useGlobal from '@/hooks/useGlobal';

import BlogPostArchive from './BlogPostArchive';
import BlogPostListEmpty from './BlogPostListEmpty';
import { parsePostDate } from './homeFormat';

const groupPostsByYear = (posts = []) => {
  const grouped = {};

  posts.forEach((post) => {
    const date = parsePostDate(post?.date?.start);
    if (!date) return;
    const year = String(date.getFullYear());
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });

  Object.values(grouped).forEach((list) => {
    list.sort((a, b) => {
      const da = parsePostDate(a?.date?.start)?.getTime() || 0;
      const db = parsePostDate(b?.date?.start)?.getTime() || 0;
      return db - da;
    });
  });

  return grouped;
};

/**
 * 归档页
 */
const PaperArchive = ({ posts = [] }) => {
  const { locale } = useGlobal();
  const archivePosts = groupPostsByYear(posts);
  const years = Object.keys(archivePosts).sort((a, b) => Number(b) - Number(a));

  return (
    <section className="relative w-full overflow-x-hidden bg-lawn-bg px-6 pb-16 pt-24 text-zinc-900 dark:text-white md:px-12 md:pb-24 md:pt-28 xl:px-16">
      <div className="pointer-events-none absolute -left-10 bottom-16 h-40 w-40 rounded-full bg-emerald-400 opacity-20 dark:opacity-10 md:h-60 md:w-60" />
      <div className="pointer-events-none absolute -right-10 top-32 h-40 w-40 rounded-full bg-teal-400 opacity-20 dark:opacity-10 md:h-60 md:w-60" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-10 md:gap-12">
        <header className="flex flex-col gap-3">
          <h1 className="flex items-center gap-3  text-3xl leading-none text-zinc-900 dark:text-white md:text-5xl">
            <span aria-hidden className="inline-block h-3 w-1.5 shrink-0 rounded-sm bg-teal-700 md:h-4 md:w-2" />
            {locale.NAV.ARCHIVE}
          </h1>
        </header>

        {!years.length ? (
          <BlogPostListEmpty />
        ) : (
          <div className="flex flex-col gap-6 md:gap-8">
            {years.map((year) => (
              <BlogPostArchive key={year} posts={archivePosts[year]} year={year} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PaperArchive;
