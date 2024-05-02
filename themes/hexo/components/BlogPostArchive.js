import { siteConfig } from '@/lib/config';
import Link from 'next/link';

/**
 * 博客归档列表
 * @param posts 所有文章
 * @param archiveTitle 归档标题
 */
const BlogPostArchive = ({ posts = [], archiveTitle }) => {
  if (!posts || posts.length === 0) {
    return <></>;
  } else {
    return (
      <div>
        <div
          className="pt-16 pb-4 font-bold text-xl dark:text-gray-300"
          id={archiveTitle}
        >
          {archiveTitle}
        </div>
        <ul>
          {posts?.map(post => (
            <li
              key={post.id}
              className="border-l-2 p-2 text-base items-center hover:scale-x-105 hover:border-teal-500 dark:hover:border-teal-300 transform duration-500"
            >
              <div id={post?.publishDay}>
                <span className="text-gray-600 dark:text-gray-300">{post.date?.start_date}</span>{' '}
                &nbsp;
                <Link
                  href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
                  passHref
                  className="notion-link leading-loose hover:text-teal-500 dark:hover:text-teal-300">
                  {post.title}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default BlogPostArchive;
