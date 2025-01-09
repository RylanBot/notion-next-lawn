import Link from 'next/link';
import { siteConfig } from '@/libs/common/config';

/**
 * 博客归档列表
 */
const BlogPostArchive = ({ posts = [], archiveTitle }) => {
  if (!posts || posts.length === 0) return <></>;

  return (
    <div className="mb-8">
      <div className="my-2 font-bold text-xl text-teal-600 dark:text-teal-400" id={archiveTitle}>
        {archiveTitle}
      </div>
      <ul>
        {posts?.map((post) => (
          <li
            key={post.id}
            className="border-l-2 p-2 text-base items-center"
          >
            <div id={post?.publishDay}>
              <span className="text-gray-600 dark:text-gray-300">{post.date?.start_date}</span> &nbsp;
              <Link
                href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
                passHref
                className="notion-link leading-loose hover:font-bold hover:text-teal-500 dark:hover:text-teal-300"
              >
                {post.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogPostArchive;
