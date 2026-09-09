import Link from 'next/link';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import BlogPostListEmpty from './BlogPostListEmpty';
import PaperPostCard from './PaperPostCard';

const CARD_ROTATES = [
  '-rotate-2 hover:rotate-0',
  'rotate-2 hover:rotate-0',
  '-rotate-1 hover:rotate-0',
  'rotate-1 hover:rotate-0',
  '-rotate-2 hover:rotate-0',
  'rotate-2 hover:rotate-0'
];

const HomeEditorial = ({ posts = [], siteInfo }) => {
  const { locale } = useGlobal();
  const POST_SUB_PATH = siteConfig('POST_SUB_PATH');
  const essays = posts.slice(0, 6);

  if (!essays.length) return <BlogPostListEmpty />;

  return (
    <section
      id="home-essays"
      className="w-full bg-lawn-bg px-6 py-16 text-zinc-900 dark:text-white md:px-12 md:py-24 xl:px-16"
    >
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-10 md:gap-14">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="flex items-center gap-3  text-2xl leading-none text-zinc-900 dark:text-white md:text-4xl">
            <span aria-hidden className="inline-block h-3 w-1.5 shrink-0 rounded-sm bg-teal-700 md:h-4 md:w-2" />
            {locale.COMMON.LATEST_POSTS}
          </h2>
          <Link
            href="/page/1"
            className="group inline-flex items-center gap-2.5 pb-2.5 text-lg font-semibold text-teal-900 dark:text-white"
          >
            <span>{locale.HOME.BROWSE_ALL}</span>
            <i aria-hidden className="fas fa-arrow-right text-lg" />
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10">
          {essays.map((post, index) => (
            <PaperPostCard
              key={post.id}
              post={post}
              siteInfo={siteInfo}
              postPath={POST_SUB_PATH}
              rotate={CARD_ROTATES[index % CARD_ROTATES.length]}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeEditorial;
