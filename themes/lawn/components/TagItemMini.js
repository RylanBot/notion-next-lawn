import Link from 'next/link';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, safeJSONParse } from '@/libs/common/util';

const TagItemMini = ({ tag, selected = false }) => {
  const { isChinese } = useGlobal();

  const TAG_SLUG_MAP = safeJSONParse(siteConfig('TAG_SLUG_MAP', {}));
  const displayName = isChinese ? TAG_SLUG_MAP[tag.name] ?? tag.name : tag.name;

  return (
    <Link
      className={`h-5 inline-flex items-center rounded duration-300 my-1 mr-2 py-0.5 px-1 text-xs whitespace-nowrap ${
        selected
          ? 'pointer-events-none border-box border-2 border-dotted border-teal-500'
          : `cursor-pointer text-gray-600 dark:border-gray-400 notion-${tag.color}_background hover:bg-teal-400 dark:hover:bg-teal-500 dark:hover:text-white hover:text-white`
      }`}
      passHref
      href={`/tag/${formatNameToSlug(tag.name)}`}
    >
      <div className="font-light">{displayName + (tag.count ? ` (${tag.count})` : '')} </div>
    </Link>
  );
};

export default TagItemMini;
