import Link from 'next/link';
import { useRouter } from 'next/router';

import clsx from 'clsx';

/**
 * 翻页数字
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter();
  const currentPage = +page;
  const showNext = page < totalPage;
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '');
  const pages = generatePages(pagePrefix, page, currentPage, totalPage);

  return (
    <div className="mt-10 flex items-center justify-center space-x-2 font-medium text-teal-900 dark:text-white">
      <Link
        className={clsx(currentPage === 1 ? 'invisible' : 'flex', 'h-6 w-6 items-center justify-center hover:text-teal-700')}
        rel="prev"
        href={{
          pathname: getPagePath(currentPage - 1, pagePrefix),
          query: router.query.s ? { s: router.query.s } : {}
        }}
      >
        <i className="fas fa-angle-left" />
      </Link>

      {pages}

      <Link
        className={clsx(+showNext ? 'flex' : 'invisible', 'h-6 w-6 items-center justify-center hover:text-teal-700')}
        rel="next"
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
      >
        <i className="fas fa-angle-right" />
      </Link>
    </div>
  );
};

function getPageElement(page, currentPage, pagePrefix) {
  return (
    <Link
      key={page}
      className={clsx(
        'inline-flex h-6 w-6 items-center justify-center rounded-full leading-none',
        page == currentPage
          ? 'pointer-events-none bg-teal-900 font-bold text-white dark:bg-white dark:text-zinc-900'
          : 'border border-teal-900/25 hover:border-teal-900 hover:text-teal-700 dark:border-white/25'
      )}
      passHref
      href={getPagePath(page, pagePrefix)}
    >
      {page}
    </Link>
  );
}

/** 全站列表第 1 页在 /page/1；分类 / 标签第 1 页仍走索引路径 */
function getPagePath(page, pagePrefix) {
  if (page === 1 && pagePrefix) {
    return `${pagePrefix}/`;
  }
  return `${pagePrefix}/page/${page}`;
}

function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = [];
  const groupCount = 7;
  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, page, pagePrefix));
    }
  } else {
    pages.push(getPageElement(1, page, pagePrefix));
    const dynamicGroupCount = groupCount - 2;
    let startPage = currentPage - 2;
    if (startPage <= 1) {
      startPage = 2;
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount;
    }
    if (startPage > 2) {
      pages.push(<div key={-1}>... </div>);
    }

    for (let i = 0; i < dynamicGroupCount; i++) {
      if (startPage + i < totalPage) {
        pages.push(getPageElement(startPage + i, page, pagePrefix));
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(<div key={-2}>... </div>);
    }

    pages.push(getPageElement(totalPage, page, pagePrefix));
  }
  return pages;
}

export default PaginationNumber;
