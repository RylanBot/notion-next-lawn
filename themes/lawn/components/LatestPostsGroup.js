import Link from 'next/link';
import { useRouter } from 'next/router';

import LazyImage from '@/plugins/base/LazyImage';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import Card from './Card';

/**
 * 最新文章列表
 * @param posts 所有文章数据
 * @param sliceCount 截取展示的数量
 */
const LatestPostsGroup = ({ latestPosts, siteInfo }) => {
  const currentPath = useRouter().asPath;
  const { locale } = useGlobal();

  const SUB_PATH = siteConfig('SUB_PATH', '');

  if (latestPosts?.length < 1 || currentPath === '/') return;

  return (
    <Card className="my-4">
      <div className="px-1 flex flex-nowrap justify-between">
        <div>
          <i className="mr-2 mb-3 fas fas fa-history" />
          {locale.COMMON.LATEST_POSTS}
        </div>
      </div>

      {latestPosts?.map((post) => {
        const selected = currentPath === `${SUB_PATH}/${post.slug}`;
        const headerImage = post?.pageCoverThumbnail ? post.pageCoverThumbnail : siteInfo?.pageCover;
        return (
          <div
            key={post.id}
            className={`my-1.5 p-1 rounded-md group ${
              selected
                ? 'pointer-events-none border-2 border-dotted border-teal-500'
                : 'hover:bg-teal-400 hover:text-white dark:hover:bg-teal-500'
            } `}
          >
            <Link title={post.title} href={`${SUB_PATH}/${post.slug}`} passHref className="flex">
              <div className="w-20 h-14 overflow-hidden relative">
                <LazyImage src={headerImage} className="object-cover w-full h-full rounded-sm" />
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
    </Card>
  );
};
export default LatestPostsGroup;
