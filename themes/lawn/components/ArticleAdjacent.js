import Link from 'next/link';

import { siteConfig } from '@/libs/common/config';
import CONFIG from '../config';

/**
 * 上一篇，下一篇文章
 */
const ArticleAdjacent = ({ prev, next }) => {
  if (!prev || !next || !siteConfig('LAWN_ARTICLE_ADJACENT', null, CONFIG)) return <></>;

  return (
    <section className="pt-8 text-gray-800 items-center text-xs md:text-sm flex justify-between m-1 ">
      <Link
        href={`/${prev.slug}`}
        passHref
        className="py-1  cursor-pointer hover:underline justify-start items-center dark:text-white flex w-full h-full duration-200"
      >
        <i className="mr-1 fas fa-angle-left" />
        {prev.title}
      </Link>
      <Link
        href={`/${next.slug}`}
        passHref
        className="py-1 cursor-pointer hover:underline justify-end items-center dark:text-white flex w-full h-full duration-200"
      >
        {next.title}
        <i className="ml-1 my-1 fas fa-angle-right" />
      </Link>
    </section>
  );
};

export default ArticleAdjacent;
