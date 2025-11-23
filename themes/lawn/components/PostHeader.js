import LazyImage from '@/plugins/base/LazyImage';
import WordCount from '@/plugins/base/WordCount';
import NotionIcon from '@/plugins/notion/NotionIcon';

import useGlobal from '@/hooks/useGlobal';

import CategoryMini from './CategoryMini';
import TagItemMini from './TagItemMini';
import WavesArea from './WavesArea';

/**
 * 文章头部背景
 */
export default function PostHeader({ post, siteInfo }) {
  const { locale, fullWidth } = useGlobal();

  if (!post) return <></>;
  if (fullWidth) return <div className="my-8" />;

  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover;

  return (
    <div id="lawn-header" className="w-full h-96 relative md:flex-shrink-0 z-10">
      <LazyImage
        key={headerImage}
        src={headerImage}
        priority={true}
        fetchpriority="high"
        className="w-full h-full object-cover object-center absolute top-0"
      />

      <div className="bg-black bg-opacity-70 absolute top-0 w-full h-96 py-10 flex justify-center items-center ">
        <div>
          {/* 分类 */}
          <div className="mb-3 flex justify-center">
            {post.category && (
              <CategoryMini
                name={post.category}
                className="cursor-pointer px-2 py-1 mb-2 rounded-sm text-sm font-medium text-white border border-white hover:border-teal-300 hover:text-teal-300 duration-200 shadow-text-md"
              />
            )}
          </div>

          {/* 文章 Title */}
          <div className="px-1 leading-snug font-bold text-2xl md:text-5xl shadow-text-md flex justify-center text-center text-white">
            <NotionIcon icon={post.pageIcon} className="text-4xl mx-1" />
            <span className="mx-1">{post.title}</span>
          </div>

          {/* 发布时间 */}
          <section className="flex-wrap shadow-text-md flex text-sm justify-center mt-4 text-white font-light leading-8">
            <div className="flex justify-center">
              {post.type !== 'Page' && post.date.start && (
                <>
                  <span className="mx-3">
                    <i className="fas fa-hourglass-half pr-2"></i>
                    <span>
                      {locale.COMMON.POST_TIME}: {post.date.start}
                    </span>
                  </span>
                </>
              )}
              {/* 最后更新 */}
              {post.date.end && (
                <div className="mx-3">
                  <i className="far fa-calendar-check pr-2"></i>
                  {locale.COMMON.LAST_EDITED_TIME}: {post.date.end}
                </div>
              )}
            </div>

            {/* 文章字数 */}
            <span className="mx-2">
              <WordCount />
            </span>

            {/* 次查看 */}
            {/* {JSON.parse(siteConfig('ANALYTICS_BUSUANZI_ENABLE')) && (
              <div className='busuanzi_container_page_pv font-light mr-2'>
                <span className='mr-2 busuanzi_value_page_pv' />
                {locale.COMMON.VIEWS}
              </div>
            )} */}
          </section>

          <div className="mt-4 mb-1">
            {post.tagItems && (
              <div className="flex justify-center flex-nowrap overflow-x-auto">
                {post.tagItems.map((tag) => (
                  <TagItemMini key={tag.name} tag={tag} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <WavesArea />
    </div>
  );
}
