import Link from 'next/link';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { formatNameToSlug, safeJSONParse } from '@/libs/common/util';

const CategoryMini = ({ name, count, icon, className }) => {
  const { isChinese } = useGlobal();
  const CATEGORY_SLUG_MAP = safeJSONParse(siteConfig('CATEGORY_SLUG_MAP', {}));

  return (
    <>
      <Link className={className} passHref href={`/category/${formatNameToSlug(name)}`}>
        {icon && <i className={icon} />}
        {isChinese ? CATEGORY_SLUG_MAP[name] ?? name : name}
        {count && <> ({count})</>}
      </Link>
    </>
  );
};

export default CategoryMini;
