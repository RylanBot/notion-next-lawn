import { siteConfig } from '@/libs/common/config';
import { useRouter } from 'next/router';

import BlogPostCard from './BlogPostCard';
import BlogPostListEmpty from './BlogPostListEmpty';
import PaginationNumber from './PaginationNumber';

/**
 * 文章列表分页表格
 */
const BlogPostListPage = ({ page = 1, posts = [], postCount, siteInfo }) => {
  const totalPage = Math.ceil(postCount / parseInt(siteConfig('POSTS_PER_PAGE')));
  const showPagination = postCount >= parseInt(siteConfig('POSTS_PER_PAGE'));

  const router = useRouter();
  const pathname = router.pathname;

  if (!posts || posts.length === 0 || page > totalPage) {
    return <BlogPostListEmpty />;
  }

  return (
    <div className={`w-full ${pathname === '/page/[page]' ? 'pt-16' : ''}`}>
      {/* 文章列表 */}
      <div className="space-y-6 px-2">
        {posts?.map((post) => (
          <BlogPostCard index={posts.indexOf(post)} key={post.id} post={post} siteInfo={siteInfo} />
        ))}
      </div>
      {showPagination && <PaginationNumber page={page} totalPage={totalPage} />}
    </div>
  );
};

export default BlogPostListPage;
