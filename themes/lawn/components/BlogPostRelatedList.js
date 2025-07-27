import Link from 'next/link';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import LazyImage from '@/plugins/base/LazyImage';

import Card from './Card';

const BlogPostRelatedList = ({ relatedPosts }) => {
  if (!relatedPosts) return;

  const { locale } = useGlobal();
  const POST_SUB_PATH = siteConfig('POST_SUB_PATH');

  return (
    <div className="mx-4 my-8">
      <p className="text-lg text-center font-bold mb-4 rainbow-text">
        <i className="fas fa-link mr-2" />
        <span>{locale.COMMON.RELATED_POSTS}</span>
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {relatedPosts.map((p) => (
          <Card
            key={p.slug}
            className="px-0 py-0 pb-2 w-52 max-md:w-40 hover:border-teal-500 dark:hover:border-teal-400 hover:scale-105 transition duration-200 overflow-hidden"
          >
            <Link className="w-full h-full flex flex-col" href={`/${POST_SUB_PATH}/${p.slug}`}>
              <LazyImage className="w-full flex-shrink-0" src={p.pageCover} />
              <div className="flex-1 px-3 pt-3 text-sm dark:text-lawn-light-gray overflow-hidden line-clamp-2">
                {p.title}
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogPostRelatedList;
