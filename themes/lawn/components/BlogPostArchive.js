import Link from 'next/link';
import { useState } from 'react';

import { siteConfig } from '@/libs/common/config';

/**
 * 博客每年归档列表
 */
const BlogPostArchive = ({ posts = [], year, collapsed }) => {
  const POST_SUB_PATH = siteConfig('POST_SUB_PATH');
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  if (!posts || posts.length === 0) return;

  return (
    <div className="mb-8">
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="flex items-center justify-center mb-2">
        <span className="mr-2 font-bold text-2xl text-teal-600 dark:text-teal-400" id={year}>
          {year}
        </span>
        <i className={`text-gray-400 ${isCollapsed ? 'fa-solid fa-plus' : 'fas fa-chevron-down'}`}></i>
      </button>

      <ul className={isCollapsed ? 'hidden' : 'ml-2'}>
        {posts?.map((post) => (
          <li
            key={post.id}
            className="border-dotted border-l-2 my-[2px] px-4 py-2 text-base items-center dark:border-zinc-600"
          >
            <div id={post.date.start}>
              <span className="text-gray-600 dark:text-gray-300">{post.date.start}</span> &nbsp;
              <Link
                className="notion-link leading-loose hover:font-bold hover:text-teal-500 dark:hover:text-teal-300"
                passHref
                href={`/${POST_SUB_PATH}/${post.slug}`}
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
