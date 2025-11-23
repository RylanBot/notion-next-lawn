import Link from 'next/link';
import { useState } from 'react';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

/**
 * 博客每年归档列表
 */
const BlogPostArchive = ({ posts = [], year, isFinal }) => {
  const POST_SUB_PATH = siteConfig('POST_SUB_PATH');
  const { locale } = useGlobal();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!posts || posts.length === 0) return null;

  const rowHeight = 48;
  const dotSize = 12;

  const dotCenterY = rowHeight / 2;
  const lineX = dotSize / 2;
  const lineY1 = dotCenterY;
  const lineY2 = (posts.length - 1) * rowHeight + dotCenterY;

  return (
    <div className={isFinal ? (isCollapsed ? '' : 'mb-6') : 'mb-6'}>
      {/* 年份 */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center gap-4 py-3 transition-all duration-300"
      >
        <span className="text-xl lg:text-2xl font-bold text-teal-600 dark:text-teal-400">{year}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {posts.length} {locale.COMMON.POSTS}
        </span>
        <i
          className={`ml-auto fa-solid fa-chevron-down text-gray-400 transition-transform duration-300 ${
            isCollapsed ? '-rotate-90' : ''
          }`}
        />
      </button>

      <ul
        className={`transition-all duration-300 overflow-hidden relative ${
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-none opacity-100'
        }`}
      >
        {/* 连接线 */}
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          style={{
            width: dotSize,
            height: posts.length * rowHeight
          }}
        >
          <line
            className="text-gray-300 dark:text-zinc-500"
            x1={lineX}
            y1={lineY1}
            x2={lineX}
            y2={lineY2}
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="2,1"
          />
        </svg>

        {posts.map((post, index) => (
          <li
            key={post.id}
            className="relative pl-8 pr-4 flex items-center"
            style={{
              height: rowHeight
            }}
          >
            {/* 圆点 */}
            <div
              className={`absolute border-2 left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
                hoveredIndex === index
                  ? 'bg-teal-500 dark:bg-teal-400 border-teal-500 dark:border-teal-400'
                  : 'bg-lawn-background-gray dark:bg-black border-gray-300 dark:border-zinc-500'
              }`}
              style={{
                width: dotSize,
                height: dotSize
              }}
            />

            {/* 内容 */}
            <Link
              href={`/${POST_SUB_PATH}/${post.slug}`}
              className="flex items-center gap-4 text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 w-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="text-sm font-mono whitespace-nowrap">{post.date.start}</span>
              <span className="truncate max-md:text-sm" title={post.title}>
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogPostArchive;
