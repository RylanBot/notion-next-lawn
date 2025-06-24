import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * 数字翻页插件
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
    <div className="mt-10 flex justify-center items-end font-medium text-black dark:text-gray-300 space-x-2">
      {/* 上一页 */}
      <Link
        className={`${
          currentPage === 1 ? 'invisible' : 'block'
        } pb-0.5 border-transparent hover:border-teal-400 w-6 text-center cursor-pointer hover:font-bold`}
        rel="prev"
        href={{
          pathname: currentPage === 2 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
      >
        <i className="fas fa-angle-left" />
      </Link>

      {pages}

      {/* 下一页 */}
      <Link
        className={`${
          +showNext ? 'block' : 'invisible'
        } pb-0.5 border-transparent hover:border-teal-400 w-6 text-center cursor-pointer hover:font-bold`}
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
      className={`pb-0.5 w-6 text-center ${
        page == currentPage
          ? 'pointer-events-none rounded-sm font-bold bg-teal-400 dark:bg-teal-500 text-white'
          : 'border-b hover:border-teal-400'
      }`}
      passHref
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
    >
      {page}
    </Link>
  );
}

function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = [];
  const groupCount = 7; // 最多显示页签数
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
