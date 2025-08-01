import Link from 'next/link';

import useGlobal from '@/hooks/useGlobal';

import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug } from '@/libs/common/util';

const TagItemMini = ({ tag, selected = false }) => {
  const { isChinese } = useGlobal();

  let TAG_SLUG_MAP = {};
  try {
    // 确保 JSON 字符串格式正确
    TAG_SLUG_MAP = JSON.parse(siteConfig('TAG_SLUG_MAP', {}));
  } catch (error) {}

  const displayName = isChinese ? TAG_SLUG_MAP[tag.name] ?? tag.name : tag.name;

  return (
    <Link
      className={`h-5 inline-flex items-center rounded duration-200 my-1 mr-2 py-0.5 px-1 text-xs whitespace-nowrap ${
        selected
          ? 'pointer-events-none border-box border-2 border-dotted border-teal-500'
          : `cursor-pointer text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background hover:bg-teal-400 dark:hover:bg-teal-500 dark:hover:text-white hover:text-white`
      }`}
      passHref
      href={`/tag/${formatNameToSlug(tag.name)}`}
    >
      <div className="font-light">{displayName + (tag.count ? ` (${tag.count})` : '')} </div>
    </Link>
  );
};

export default TagItemMini;
