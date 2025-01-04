import Link from 'next/link';

import LazyImage from '@/plugins/LazyImage';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';
import { BlogPostCardInfo } from './BlogPostCardInfo';

/**
 * 首页文章小卡片
 */
const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  if (post && !post.pageCoverThumbnail && siteConfig('LAWN_POST_LIST_COVER_DEFAULT', null, CONFIG)) {
    post.pageCoverThumbnail = siteInfo?.pageCover;
  }
  const showPreview = siteConfig('LAWN_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap;
  const showPageCover = siteConfig('LAWN_POST_LIST_COVER', null, CONFIG) && post?.pageCoverThumbnail && !showPreview;

  return (
    <div
      className={
        `${siteConfig('LAWN_POST_LIST_COVER_HOVER_ENLARGE', null, CONFIG)
          ? 'hover:scale-110 transition-all duration-150'
          : ''
        }` || undefined
      }
    >
      <div
        key={post.id}
        data-aos="fade-up"
        data-aos-easing="ease-in-out"
        data-aos-duration="600"
        data-aos-once="false"
        data-aos-anchor-placement="top-bottom"
        id="blog-post-card"
        className={`group md:h-56 w-full flex justify-between md:flex-row flex-col-reverse overflow-hidden border-2 border-teal-600 dark:border-teal-500 rounded-lg bg-white dark:bg-lawn-black-gray ${siteConfig('LAWN_POST_LIST_IMG_CROSSOVER', null, CONFIG) && index % 2 === 1
            ? 'md:flex-row-reverse'
            : ''}`}
      >
        {/* 文字内容 */}
        <BlogPostCardInfo
          index={index}
          post={post}
          showPageCover={showPageCover}
          showPreview={showPreview}
          showSummary={showSummary}
        />

        {/* 图片封面 */}
        {showPageCover && (
          <div className={`md:w-5/12 overflow-hidden border-dashed border-teal-600 dark:border-teal-500 max-md:border-b-2 ${index % 2 === 0 ? 'lg:border-l-2' : 'lg:border-r-2'}`}>
            <Link href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}>
              <LazyImage
                priority={index === 1}
                src={post?.pageCoverThumbnail}
                className="h-56 w-full object-cover object-center border-1 border-dashed border-teal-600"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostCard;
