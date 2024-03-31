import Link from 'next/link';

import LazyImage from '@/components/LazyImage';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';
import { BlogPostCardInfo } from './BlogPostCardInfo';

/**
 * 首页博客小卡片
 */
const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview = siteConfig('HEXO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap;
  if (post && !post.pageCoverThumbnail && siteConfig('HEXO_POST_LIST_COVER_DEFAULT', null, CONFIG)) {
    post.pageCoverThumbnail = siteInfo?.pageCover;
  }
  const showPageCover = siteConfig('HEXO_POST_LIST_COVER', null, CONFIG) && post?.pageCoverThumbnail && !showPreview;

  return (
        <div className={`${siteConfig('HEXO_POST_LIST_COVER_HOVER_ENLARGE', null, CONFIG) ? ' hover:scale-110 transition-all duration-150' : ''}`} >
            <div key={post.id}
                data-aos="fade-up"
                data-aos-easing="ease-in-out"
                data-aos-duration="800"
                data-aos-once="false"
                data-aos-anchor-placement="top-bottom"
                id='blog-post-card'
                className={`group md:h-64 w-full flex justify-between md:flex-row flex-col-reverse ${siteConfig('HEXO_POST_LIST_IMG_CROSSOVER', null, CONFIG) && index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                    overflow-hidden border-2 border-teal-600 dark:border-teal-500 rounded-lg bg-white dark:bg-hexo-black-gray`}>

                {/* 文字内容 */}
                <BlogPostCardInfo index={index} post={post} showPageCover={showPageCover} showPreview={showPreview} showSummary={showSummary} />

                {/* 图片封面 */}
                {showPageCover && (
                    <div className={`md:w-5/12 overflow-hidden border-dashed border-teal-600 dark:border-teal-500 ${index % 2 === 0 ? 'lg:border-l-2' : 'lg:border-r-2'} max-md:border-b-2`}>
                        <Link href={`${siteConfig('SUB_PATH', '')}/${post.slug}`} passHref legacyBehavior>
                            <LazyImage priority={index === 1} src={post?.pageCoverThumbnail} className='h-64 w-full object-cover object-center group-hover:scale-110 duration-500 border-1 border-dashed border-teal-600' />
                        </Link>
                    </div>
                )}
            </div>
        </div>
  );
};

export default BlogPostCard;
