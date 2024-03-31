import Link from 'next/link';

import LazyImage from '@/components/LazyImage';
import NotionIcon from '@/components/NotionIcon';
import WordCount from '@/components/WordCount';
import { useGlobal } from '@/lib/global';

import TagItemMini from './TagItemMini';
import WavesArea from './WavesArea';

export default function PostHeader({ post, siteInfo }) {
  const { locale, fullWidth } = useGlobal();

  if (!post) {
    return <></>;
  }

  // 文章全屏隐藏标头
  if (fullWidth) {
    return <div className='my-8' />;
  }

  const headerImage = post?.pageCover ? post.pageCover : siteInfo?.pageCover;

  return (
    <div id='header' className='w-full h-96 relative md:flex-shrink-0 z-10'>
      <LazyImage
        priority={true}
        src={headerImage}
        className='w-full h-full object-cover object-center absolute top-0'
      />

      <header
        id='article-header-cover'
        className='bg-black bg-opacity-70 absolute top-0 w-full h-96 py-10 flex justify-center items-center '
      >
        <div className='mt-10'>
          {/* 分类 */}
          <div className='mb-3 flex justify-center'>
            {post.category && (
              <>
                <Link
                  href={`/category/${post.category}`}
                  passHref
                  className="cursor-pointer px-2 py-1 mb-2 rounded-sm text-sm font-medium text-white border border-white hover:border-teal-300 hover:text-teal-300 duration-200 shadow-text-md">
                  {post.category}
                </Link>
              </>
            )}
          </div>

          {/* 文章 Title */}
          <div className='leading-snug font-bold xs:text-4xl sm:text-4xl md:text-5xl md:leading-snug text-4xl shadow-text-md flex justify-center text-center text-white'>
            <NotionIcon icon={post.pageIcon} className='text-4xl mx-1' />
            {post.title}
          </div>

          {/* 发布时间 */}
          <section className='flex-wrap shadow-text-md flex text-sm justify-center mt-4 text-white dark:text-gray-400 font-light leading-8'>
            <div className='flex justify-center dark:text-gray-200 text-opacity-70'>
              {post?.type !== 'Page' && (
                <>
                  <>
                    {post?.publishDay && (
                      <span className="mx-3">
                        <i className="fas fa-hourglass-half pr-2"></i>
                        <span>{locale.COMMON.POST_TIME}: {post.publishDay}</span>
                      </span>
                    )}
                  </>
                </>
              )}
              {/* 最后更新 */}
              {post?.finished_date && post?.finished_date !== 'Invalid Date' && (
                <div className='mx-3'>
                  <i className="far fa-calendar-check pr-2"></i>
                  {locale.COMMON.LAST_EDITED_TIME}: {post.finished_date}
                </div>
              )}
            </div>

            {/* 文章字数 */}
            <span className='mx-2'><WordCount /></span>

            {/* 次查看 */}
            {/* {JSON.parse(siteConfig('ANALYTICS_BUSUANZI_ENABLE')) && (
              <div className='busuanzi_container_page_pv font-light mr-2'>
                <span className='mr-2 busuanzi_value_page_pv' />
                {locale.COMMON.VIEWS}
              </div>
            )} */}
          </section>

          <div className='mt-4 mb-1'>
            {post.tagItems && (
              <div className='flex justify-center flex-nowrap overflow-x-auto'>
                {post.tagItems.map(tag => (
                  <TagItemMini key={tag.name} tag={tag} />
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <WavesArea />
    </div>
  );
}
