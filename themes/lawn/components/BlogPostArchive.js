import Link from 'next/link';
import { useState } from 'react';

import clsx from 'clsx';

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
  const dotSize = 6;

  const dotCenterY = rowHeight / 2;
  const lineX = dotSize / 2;

  const lineY1 = dotCenterY;
  const lineY2 = (posts.length - 1) * rowHeight + dotCenterY;

  return (
    <div className={isFinal ? (isCollapsed ? '' : 'mb-6') : 'mb-6'}>
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="w-full flex items-center gap-4 py-3">
        {/* 年份 */}
        <span className="text-2xl lg:text-3xl font-bold text-teal-500 dark:text-teal-400">{year}</span>

        {/* 文章数量 */}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {posts.length} {locale.COMMON.POSTS}
        </span>

        {/* 折叠图标 */}
        <i
          className={clsx(
            'ml-auto fa-solid fa-chevron-down',
            'text-teal-600 dark:text-teal-400',
            'transition-transform duration-300',
            isCollapsed && '-rotate-90'
          )}
        />
      </button>

      <ul
        className={clsx(
          'relative overflow-hidden transition-all duration-300',
          isCollapsed ? 'max-h-0 opacity-0' : 'max-h-none opacity-100'
        )}
      >
        {/* 竖线 */}
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          style={{
            width: dotSize,
            height: posts.length * rowHeight
          }}
        >
          <line
            x1={lineX}
            y1={lineY1}
            x2={lineX}
            y2={lineY2}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2,3"
            className="text-gray-200 dark:text-zinc-700"
          />
        </svg>

        {posts.map((post, index) => (
          <li key={post.id} className="relative flex items-center pl-6 pr-4" style={{ height: rowHeight }}>
            {/* 小圆点 */}
            <div
              className={clsx(
                'absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-200',
                hoveredIndex === index ? 'bg-teal-500 dark:bg-teal-400' : 'bg-gray-300 dark:bg-zinc-600'
              )}
              style={{
                width: dotSize,
                height: dotSize
              }}
            />

            {/* 内容 */}
            <Link
              href={`/${POST_SUB_PATH}/${post.slug}`}
              className="group flex items-center gap-4 w-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="text-xs font-mono text-gray-400 whitespace-nowrap">{post.date.start}</span>

              <span
                className={clsx(
                  'truncate text-gray-700 dark:text-gray-200',
                  'group-hover:text-teal-600 dark:group-hover:text-teal-400',
                  'group-hover:font-medium'
                )}
                title={post.title}
              >
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
