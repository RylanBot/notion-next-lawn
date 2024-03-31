import { useEffect, useRef, useState } from 'react';

import { getListByPage } from '@/lib/utils';

import { siteConfig } from '@/lib/config';
import { useGlobal } from '@/lib/global';

import CONFIG from '../config';
import BlogPostCard from './BlogPostCard';
import BlogPostListEmpty from './BlogPostListEmpty';

/**
 * 博客列表滚动分页
 */
const BlogPostListScroll = ({ posts = [], currentSearch, showSummary = siteConfig('HEXO_POST_LIST_SUMMARY', null, CONFIG), siteInfo }) => {
  const postsPerPage = parseInt(siteConfig('POSTS_PER_PAGE'));
  const [page, updatePage] = useState(1);
  const postsToShow = getListByPage(posts, page, postsPerPage);

  let hasMore = false;
  if (posts) {
    const totalCount = posts.length;
    hasMore = page * postsPerPage < totalCount;
  }

  const handleGetMore = () => {
    if (!hasMore) return;
    updatePage(page + 1);
  };

  // 监听滚动自动分页加载
  const scrollTrigger = () => {
    requestAnimationFrame(() => {
      const scrollS = window.scrollY + window.outerHeight;
      const clientHeight = targetRef ? (targetRef.current ? (targetRef.current.clientHeight) : 0) : 0;
      if (scrollS > clientHeight + 100) {
        handleGetMore();
      }
    });
  };

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger);
    return () => {
      window.removeEventListener('scroll', scrollTrigger);
    };
  });

  const targetRef = useRef(null);
  const { locale } = useGlobal();

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />;
  } else {
    return <div id='container' ref={targetRef} className='w-full'>

      {/* 文章列表 */}
      <div className="space-y-6 px-2">
        {postsToShow.map(post => (
          <BlogPostCard key={post.id} post={post} showSummary={showSummary} siteInfo={siteInfo} />
        ))}
      </div>

      <div>
        <div onClick={() => { handleGetMore(); }}
          className='w-full my-4 py-4 text-center cursor-pointer rounded-xl dark:text-gray-200'
        > {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE}`} </div>
      </div>
    </div>;
  }
};

export default BlogPostListScroll;
