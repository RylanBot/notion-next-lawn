import Link from 'next/link';
import { useRouter } from 'next/router';

import LazyImage from '@/components/LazyImage';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';

/**
 * 最新文章列表
 * @param posts 所有文章数据
 * @param sliceCount 截取展示的数量
 */
const LatestPostsGroup = ({ latestPosts, siteInfo }) => {
  // 获取当前路径
  const currentPath = useRouter().asPath;
  const { locale } = useGlobal();

  if (!latestPosts) {
    return <></>;
  }

  return (
    <>
      <div className="px-1 flex flex-nowrap justify-between">
        <div>
          <i className="mr-2 fas fas fa-history" />
          {locale.COMMON.LATEST_POSTS}
        </div>
      </div>

      {latestPosts.map((post) => {
        const selected = currentPath === `${siteConfig('SUB_PATH', '')}/${post.slug}`;
        const headerImage = post?.pageCoverThumbnail ? post.pageCoverThumbnail : siteInfo?.pageCover;

        return (
          <Link
            key={post.id}
            title={post.title}
            href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
            passHref
            className={`my-3 flex hover:text-teal-500 dark:hover:text-teal-400 ${
              selected ? 'text-teal-600 dark:text-gray-200 pointer-events-none' : ''
            }`}
            aria-disabled={selected}
          >
            <div className="w-20 h-14 overflow-hidden relative">
              <LazyImage src={`${headerImage}`} className="object-cover w-full h-full" />
            </div>
            <div className="overflow-x-hidden px-2 duration-200 w-full rounded cursor-pointer items-center flex">
              <div className="w-full">
                <div className={`text-sm line-clamp-2 menu-link`}>{post.title}</div>
                <div className="text-gray-400 dark:text-gray-500 text-xs">{post.publishDay}</div>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};
export default LatestPostsGroup;
