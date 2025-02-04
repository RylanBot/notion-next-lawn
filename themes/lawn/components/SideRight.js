import throttle from 'lodash/throttle';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/libs/common/config';
import Live2D from '@/plugins/animation/Live2D';

import CONFIG from '../config';
import AnalyticsCard from './AnalyticsCard';
import Announcement from './Announcement';
import ArchiveCard from './ArchiveCard';
import Card from './Card';
import Catalog from './Catalog';
import CategoryGroup from './CategoryGroup';
import InfoCard from './InfoCard';
import LatestPostsGroup from './LatestPostsGroup';
import TagGroups from './TagGroups';

/**
 * 侧边栏
 */
const SideRight = (props) => {
  const { post, rightAreaSlot, notice } = props;
  const router = useRouter();
  const LAWN_WIDGET_ANALYTICS = siteConfig('LAWN_WIDGET_ANALYTICS', null, CONFIG);

  const [hasToc, setHasToc] = useState(false);
  const [showToc, setShowToc] = useState(false);

  const sideRightRef = useRef(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    setHasToc(post?.toc?.length > 1);
    setShowToc(post?.toc?.length > 1);
  }, [post]);

  useEffect(() => {
    if (!sideRightRef.current) return;

    // 同步侧边栏和整体页面的滚动进度
    const handleSyncScroll = throttle(() => {
      const pageScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pageScrollTop = window.scrollY;
      const sideRightScrollHeight = sideRightRef.current.scrollHeight - sideRightRef.current.clientHeight;

      // 判断滚动方向
      const isScrollingUp = pageScrollTop < lastScrollTop.current;
      const scrollDelta = Math.abs(pageScrollTop - lastScrollTop.current);
      lastScrollTop.current = pageScrollTop;

      // 如果增量小于阈值，忽略此次滚动 -> 否则容易有抖动现象
      const scrollThreshold = 10;
      if (scrollDelta < scrollThreshold) return;

      let sideRightScrollTop = (pageScrollTop / pageScrollHeight) * sideRightScrollHeight;

      // 向上滚动 -> 加快看到顶部 Tab
      if (isScrollingUp) {
        sideRightScrollTop = Math.max(0, sideRightScrollTop - 100);
      }

      // 四舍五入 -> 避免小数点导致的抖动
      sideRightRef.current.scrollTop = Math.round(sideRightScrollTop);
    }, 100);

    window.addEventListener('scroll', handleSyncScroll);
    return () => {
      window.removeEventListener('scroll', handleSyncScroll);
    };
  }, []);

  if (post?.fullWidth) return null;

  return (
    <div className="flex flex-col px-1 lg:w-96">
      {/* 切换 Tab */}
      {hasToc && (
        <div className="flex justify-center items-center mb-4 lg:sticky top-6">
          <button
            className={`w-1/2 px-4 py-1 rounded mr-2 ${
              showToc ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setShowToc(true)}
          >
            <i className="fas fa-stream" />
          </button>
          <button
            className={`w-1/2 px-4 py-1 rounded ${!showToc ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setShowToc(false)}
          >
            <i className="fas fa-seedling" />
          </button>
        </div>
      )}

      {/* ⚠️ sticky 元素应该是可滚动元素的直接子元素，否则不生效*/}
      <div
        id="sideRight"
        ref={sideRightRef}
        className={`bg-lawn-background-gray dark:bg-black scroll-smooth scrollbar-hidden lg:max-h-screen lg:sticky ${
          hasToc ? 'top-[68px]' : 'top-4'
        }`}
      >
        <div className="w-full">
          {/* 目录 */}
          <div className={`w-full ${showToc ? '' : 'hidden'}`}>
            {post?.toc?.length > 1 && (
              <Card>
                <Catalog toc={post.toc} />
              </Card>
            )}
          </div>

          {/* 网站信息 */}
          <div className={`w-full ${!showToc ? '' : 'hidden'}`}>
            {/* 个人信息卡 */}
            <InfoCard className={post || router.route === '/' ? undefined : 'mt-16'} {...props} />

            {/* 网站数据卡 */}
            {LAWN_WIDGET_ANALYTICS && <AnalyticsCard {...props} />}

            {/* 归档卡 */}
            <ArchiveCard postCount={props.allNavPages?.length ?? 0} />

            {/* 分类卡 */}
            <CategoryGroup />

            {/* 标签卡 */}
            <TagGroups />

            {/* 最新文章 */}
            <LatestPostsGroup {...props} />

            {/* 公告 */}
            <Announcement post={notice} className="mt-8" />

            {/* {siteConfig('COMMENT_WALINE_SERVER_URL') && siteConfig('COMMENT_WALINE_RECENT') && <LawnRecentComments />} */}

            {rightAreaSlot}
            <Live2D />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideRight;
