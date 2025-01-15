import Link from 'next/link';

import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, isChinese } from '@/libs/common/util';

const CategoryMini = ({ name, count, icon, className }) => {
  let CATEGORY_SLUG_MAP = {};
  try {
    // 确保 JSON 字符串格式正确
    CATEGORY_SLUG_MAP = JSON.parse(siteConfig('CATEGORY_SLUG_MAP', {}));
  } catch (error) {}

  return (
    <>
      <Link className={className} href={`/category/${formatNameToSlug(name)}`} passHref>
        {icon && <i className={`${icon}`} />}
        {isChinese ? CATEGORY_SLUG_MAP[name] ?? name : name}
        {count && <>({count})</>}
      </Link>
    </>
  );
};

export default CategoryMini;
