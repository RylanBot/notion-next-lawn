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
          <i className="mr-2 mb-3 fas fas fa-history" />
          {locale.COMMON.LATEST_POSTS}
        </div>
      </div>

      {latestPosts.map((post) => {
        const selected = currentPath === `${siteConfig('SUB_PATH', '')}/${post.slug}`;
        const headerImage = post?.pageCoverThumbnail ? post.pageCoverThumbnail : siteInfo?.pageCover;
        return (
          <div
            key={post.id}
            className={`p-2 rounded-md group ${selected ? '' : 'hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600'} `}
          >
            <Link
              title={post.title}
              href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
              passHref
              className={`flex ${selected ? 'text-teal-600 dark:text-teal-300 pointer-events-none' : ''}`}
              aria-disabled={selected}
            >
              <div className="w-20 h-14 overflow-hidden relative">
                <LazyImage src={`${headerImage}`} className="object-cover w-full h-full" />
              </div>
              <div className="overflow-x-hidden px-2 w-full rounded cursor-pointer flex items-center">
                <div className="w-full">
                  <div className={`text-sm line-clamp-2 menu-link`}>{post.title}</div>
                  <div className={`text-gray-400 text-xs ${selected ? '' : 'group-hover:text-gray-200'}`}>
                    {post.publishDay}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
};
export default LatestPostsGroup;
