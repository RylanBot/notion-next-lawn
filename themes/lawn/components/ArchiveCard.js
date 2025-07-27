import Link from 'next/link';
import { useRouter } from 'next/router';

import useGlobal from '@/hooks/useGlobal';

/**
 * 归档卡片
 */
const ArchiveCard = ({ postCount }) => {
  const inArchive = useRouter().pathname === '/archive';
  const { locale } = useGlobal();

  return (
    <Link
      className={`lg:my-4 rounded-lg px-4 pl-6 py-3 bg-white dark:bg-lawn-black-gray dark:text-gray-300 flex justify-between items-center ${
        inArchive
          ? 'pointer-events-none border-2 border-dotted border-teal-500'
          : 'hover:bg-teal-400 border dark:border-zinc-500 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white'
      }`}
      href="/archive"
    >
      <div>
        <i className="fa-solid fa-archive mr-1.5 max-md:mr-[7px]"></i>
        {locale.NAV.ARCHIVE} ({postCount})
      </div>
    </Link>
  );
};
export default ArchiveCard;
