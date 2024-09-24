import Link from 'next/link';
import { useRouter } from 'next/router';

import { useGlobal } from '@/hooks/useGlobal';

/**
 * 归档卡片
 */
const ArchiveCard = ({ postCount }) => {
  const inArchive = useRouter().pathname === '/archive';
  const { locale } = useGlobal();

  return (
    <Link
      href="/archive"
      className={`my-4 shadow-md rounded-xl px-8 py-3 max-md:px-6 bg-white dark:bg-lawn-black-gray dark:text-gray-300 flex justify-between items-center ${
        inArchive
          ? 'pointer-events-none border-2 border-dotted border-teal-500'
          : 'hover:bg-teal-400 border dark:border-black hover:text-white dark:hover:bg-teal-500 dark:hover:text-white'
      }`}
    >
      <div>
        <i className="fa-solid fa-archive mr-1.5 max-md:mr-[7px]"></i>
        {locale.NAV.ARCHIVE}({postCount})
      </div>
      {/* <div><i className="fa-solid fa-arrow-right text-2xl"></i></div> */}
    </Link>
  );
};
export default ArchiveCard;
