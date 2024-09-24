// import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import Live2D from '@/components/Live2D';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';
import { AnalyticsCard } from './AnalyticsCard';
import Announcement from './Announcement';
import ArchiveCard from './ArchiveCard';
import Card from './Card';
import Catalog from './Catalog';
import CategoryGroup from './CategoryGroup';
import { InfoCard } from './InfoCard';
import LatestPostsGroup from './LatestPostsGroup';
import TagGroups from './TagGroups';

// const LawnRecentComments = dynamic(() => import('./LawnRecentComments'))

/**
 * 主题右侧栏
 */
export default function SideRight(props) {
  const { post, rightAreaSlot, notice } = props;

  const LAWN_WIDGET_ANALYTICS = siteConfig('LAWN_WIDGET_ANALYTICS', null, CONFIG);

  const getInitialTab = (post) => {
    return post?.toc?.length > 1 ? 'toc' : 'info';
  };

  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState(() => getInitialTab(post));

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setActiveTab(getInitialTab(post));
  }, [post]);

  if (post?.fullWidth) return null;

  return (
    <>
      {hydrated && (
        <div id="sideRight" className="p-2 max-lg:mt-8 max-md:mt-4">
          {/* 切换 Tab */}
          {post && post.toc && post.toc.length > 1 && (
            <div className="lg:w-72 flex justify-center items-center mb-4">
              <button
                className={`w-1/2 px-4 py-1 rounded mr-2 ${
                  activeTab === 'toc' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setActiveTab('toc')}
              >
                <i className="fas fa-stream" />
              </button>
              <button
                className={`w-1/2 px-4 py-1 rounded ${
                  activeTab === 'info' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setActiveTab('info')}
              >
                <i className="fas fa-seedling" />
              </button>
            </div>
          )}

          {/* 目录 */}
          <div className={`lg:w-72 toc-card sticky top-32 ${activeTab === 'toc' ? '' : 'hidden'}`}>
            {post && post.toc && post.toc.length > 1 && (
              <Card>
                <Catalog toc={post.toc} />
              </Card>
            )}
          </div>

          <div className={`lg:w-72 info-card ${activeTab === 'info' ? '' : 'hidden'}`}>
            {/* 个人信息卡 */}
            <InfoCard {...props} />

            {/* 网站数据卡 */}
            {LAWN_WIDGET_ANALYTICS && <AnalyticsCard {...props} />}

            {/* 归档卡 */}
            <ArchiveCard postCount={props.postCount} />

            {/* 分类卡 */}
            <CategoryGroup />

            {/* 标签卡 */}
            <TagGroups />

            {/* 最新文章 */}
            <LatestPostsGroup {...props} />

            {/* 公告 */}
            <Announcement post={notice} className="mt-8" />

            {/* {siteConfig('COMMENT_WALINE_SERVER_URL') && siteConfig('COMMENT_WALINE_RECENT') && <LawnRecentComments />} */}
          </div>

          {/* ⚠️ sticky 元素应该是可滚动元素的直接子元素，否则不生效 */}
          <div className={`lg:w-64 sticky top-96 ${activeTab === 'info' ? '' : 'hidden'}`}>
            {rightAreaSlot}
            <Live2D />
          </div>
        </div>
      )}
    </>
  );
}
