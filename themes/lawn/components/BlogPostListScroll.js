import { useEffect, useRef, useState } from 'react';

import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';
import BlogPostCard from './BlogPostCard';
import BlogPostListEmpty from './BlogPostListEmpty';

/**
 * 博客列表滚动分页
 */
const BlogPostListScroll = ({ posts = [], currentSearch, siteInfo }) => {
  const { locale } = useGlobal();
  const targetRef = useRef(null);
  const [page, setPage] = useState(1);

  const POSTS_PER_PAGE = parseInt(siteConfig('POSTS_PER_PAGE'));
  const SHOW_SUMMARY = siteConfig('LAWN_POST_LIST_SUMMARY', null, CONFIG);

  const postsToShow = posts.slice(page * POSTS_PER_PAGE);

  let hasMore = false;
  if (posts) {
    const totalCount = posts.length;
    hasMore = page * POSTS_PER_PAGE < totalCount;
  }

  const handleGetMore = () => {
    if (!hasMore) return;
    setPage(page + 1);
  };

  // 监听滚动自动分页加载
  const scrollTrigger = () => {
    requestAnimationFrame(() => {
      const scrollS = window.scrollY + window.outerHeight;
      const clientHeight = targetRef ? (targetRef.current ? targetRef.current.clientHeight : 0) : 0;
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
  }, []);

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />;
  }

  return (
    <div id="container" ref={targetRef} className="w-full">
      {/* 文章列表 */}
      <div className="space-y-6 px-2">
        {postsToShow.map((post) => (
          <BlogPostCard key={post.id} post={post} showSummary={SHOW_SUMMARY} siteInfo={siteInfo} />
        ))}
      </div>

      <div>
        <div
          onClick={() => {
            handleGetMore();
          }}
          className="w-full my-4 py-4 text-center cursor-pointer rounded-xl dark:text-gray-200"
        >
          {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE}`}{' '}
        </div>
      </div>
    </div>
  );
};

export default BlogPostListScroll;
