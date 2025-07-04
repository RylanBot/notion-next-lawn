import Link from 'next/link';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';

const MenuGroupCard = (props) => {
  const { postCount, categoryOptions, tagOptions } = props;
  const { locale } = useGlobal();

  const archiveSlot = <div className="text-center">{postCount}</div>;
  const categorySlot = <div className="text-center">{categoryOptions?.length}</div>;
  const tagSlot = <div className="text-center">{tagOptions?.length}</div>;

  const links = [
    {
      name: locale.COMMON.ARTICLE,
      to: '/archive',
      slot: archiveSlot,
      show: siteConfig('LAWN_MENU_ARCHIVE', null, CONFIG)
    },
    {
      name: locale.COMMON.CATEGORY,
      to: '/category',
      slot: categorySlot,
      show: siteConfig('LAWN_MENU_CATEGORY', null, CONFIG)
    },
    { name: locale.COMMON.TAGS, to: '/tag', slot: tagSlot, show: siteConfig('LAWN_MENU_TAG', null, CONFIG) }
  ];

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i;
    }
  }

  return (
    <nav className="leading-8 flex justify-center  dark:text-gray-200 w-full">
      {links.map((link) => {
        if (link.show) {
          return (
            <Link
              key={`${link.to}`}
              className={'py-1.5 my-1 px-2 text-base justify-center items-center cursor-pointer'}
              href={link.to}
              target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
            >
              <div className="w-full items-center justify-center hover:scale-105 transform dark:hover:text-teal-400 hover:text-teal-500">
                <div className="text-center">{link.name}</div>
                <div className="text-center font-semibold">{link.slot}</div>
              </div>
            </Link>
          );
        } else {
          return null;
        }
      })}
    </nav>
  );
};
export default MenuGroupCard;
