import { useEffect, useState } from 'react'

import Card from './Card'
import CategoryGroup from './CategoryGroup'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import { AnalyticsCard } from './AnalyticsCard'
import CONFIG from '../config'
import dynamic from 'next/dynamic'
import Announcement from './Announcement'
import Live2D from '@/components/Live2D'
import { siteConfig } from '@/lib/config'

const HexoRecentComments = dynamic(() => import('./HexoRecentComments'))
const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * Hexo主题右侧栏
 * @param {*} props
 * @returns
 */
export default function SideRight(props) {
  const {
    post, currentCategory, categories, latestPosts, tags,
    currentTag, showCategory, showTag, rightAreaSlot, notice
  } = props

  const [activeTab, setActiveTab] = useState('info');

  // 文章全屏处理
  if (post && post?.fullWidth) {
    return null
  }

  useEffect(() => {
    setActiveTab('info');
    if (post && post.toc && post.toc.length > 1) {
      setActiveTab('toc');
    }
  }, [post?.toc])

  return (
    <div id='sideRight' className='p-2 max-lg:mt-8'>
      {post && post.toc && post.toc.length > 1 &&
        <div className="lg:w-64 flex justify-center items-center mb-4">
          <button
            className={`w-1/2 px-4 py-1 rounded mr-2 ${activeTab === 'toc' ? 'bg-indigo-400 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('toc')}
          >
            <i className='fas fa-stream' />
          </button>
          <button
            className={`w-1/2 px-4 py-1 rounded ${activeTab === 'info' ? 'bg-indigo-400 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('info')}
          >
            <i class="fas fa-seedling" />
          </button>
        </div>
      }
      <div className={`lg:w-64 toc-card sticky top-20 ${activeTab !== 'toc' && 'hidden'}`}>
        {post && post.toc && post.toc.length > 1 &&
          <Card>
            <Catalog toc={post.toc} />
          </Card>
        }
      </div>
      <div className={`lg:w-64 info-card ${activeTab !== 'info' && 'hidden'}`}>
        <InfoCard {...props} />

        {siteConfig('HEXO_WIDGET_ANALYTICS', null, CONFIG) &&
          <AnalyticsCard {...props} />
        }

        {showCategory && (
          <Card>
            <div className='ml-2 mb-1 '>
              <i className='fas fa-th' /> {locale.COMMON.CATEGORY}
            </div>
            <CategoryGroup
              currentCategory={currentCategory}
              categories={categories}
            />
          </Card>
        )}

        {showTag && (
          <Card>
            <TagGroups tags={tags} currentTag={currentTag} />
          </Card>
        )}

        {siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG)
          && latestPosts && latestPosts.length > 0 && (
            <Card>
              <LatestPostsGroup {...props} />
            </Card>
          )}

        <Announcement post={notice} className="mt-8" />

        {siteConfig('COMMENT_WALINE_SERVER_URL') && siteConfig('COMMENT_WALINE_RECENT') &&
          <HexoRecentComments />
        }

        <div className='mt-12'>
          {rightAreaSlot}
          <FaceBookPage />
          <Live2D />
        </div>
      </div>
    </div>
  );
};
