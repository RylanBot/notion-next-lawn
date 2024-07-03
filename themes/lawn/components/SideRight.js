import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Live2D from '@/components/Live2D';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';
import { AnalyticsCard } from './AnalyticsCard';
import Announcement from './Announcement';
import Card from './Card';
import Catalog from './Catalog';
import CategoryGroup from './CategoryGroup';
import { InfoCard } from './InfoCard';
import LatestPostsGroup from './LatestPostsGroup';
import TagGroups from './TagGroups';

// const LawnRecentComments = dynamic(() => import('./LawnRecentComments'))
const FaceBookPage = dynamic(
  () => {
    let facebook = <></>;
    try {
      facebook = import('@/components/FacebookPage');
    } catch (err) {
      console.error(err);
    }
    return facebook;
  },
  { ssr: false }
);

/**
 * 主题右侧栏
 */
export default function SideRight(props) {
  const {
    post,
    currentCategory,
    categories,
    latestPosts,
    tags,
    currentTag,
    showCategory,
    showTag,
    rightAreaSlot,
    notice
  } = props;

  const router = useRouter();

  const { locale } = useGlobal();
  const LAWN_WIDGET_ANALYTICS = siteConfig('LAWN_WIDGET_ANALYTICS', null, CONFIG);
  const LAWN_WIDGET_LATEST_POSTS = siteConfig('LAWN_WIDGET_LATEST_POSTS', null, CONFIG);

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
        <div id="sideRight" className="p-2 max-lg:mt-8">
          {post && post.toc && post.toc.length > 1 && (
            <div className="lg:w-64 flex justify-center items-center mb-4">
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
          <div className={`lg:w-64 toc-card sticky top-32 ${activeTab === 'toc' ? '' : 'hidden'}`}>
            {post && post.toc && post.toc.length > 1 && (
              <Card>
                <Catalog toc={post.toc} />
              </Card>
            )}
          </div>

          <div className={`lg:w-64 info-card ${activeTab === 'info' ? '' : 'hidden'}`}>
            <InfoCard {...props} />

            {LAWN_WIDGET_ANALYTICS && <AnalyticsCard {...props} />}

            {showCategory && (
              <Card>
                <div className="ml-2 mb-1 ">
                  <i className="fas fa-th" /> {locale.COMMON.CATEGORY}
                </div>
                <CategoryGroup currentCategory={currentCategory} categories={categories} />
              </Card>
            )}

            {showTag && (
              <Card>
                <TagGroups tags={tags} currentTag={currentTag} />
              </Card>
            )}

            {LAWN_WIDGET_LATEST_POSTS && router.pathname !== '/' && latestPosts && latestPosts.length > 0 && (
              <Card className="my-4">
                <LatestPostsGroup {...props} />
              </Card>
            )}

            <Announcement post={notice} className="mt-8" />

            {/* {siteConfig('COMMENT_WALINE_SERVER_URL') && siteConfig('COMMENT_WALINE_RECENT') && <LawnRecentComments />} */}

            <FaceBookPage />
          </div>

          {/* sticky 元素应该是可滚动元素的直接子元素，否则不生效 */}
          <div className={`lg:w-64 sticky top-96 pl-8 pt-20 ${activeTab === 'info' ? '' : 'hidden'}`}>
            {rightAreaSlot}
            <Live2D />
          </div>
        </div>
      )}
    </>
  );
}
