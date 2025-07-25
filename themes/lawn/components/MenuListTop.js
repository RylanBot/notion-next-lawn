import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import TravellingsLink from '@/plugins/base/TravellingsLink';

import CONFIG from '../config';
import MenuItemDrop from './MenuItemDrop';

const MenuListTop = (props) => {
  const { customNav, customMenu } = props;

  const { locale } = useGlobal();
  const TRAVELLING_LINK = siteConfig('TRAVELLING_LINK');

  let links = [
    {
      id: 1,
      icon: 'fa-solid fa-house',
      name: locale.NAV.INDEX,
      to: '/',
      show: siteConfig('LAWN_MENU_INDEX', null, CONFIG)
    },
    {
      id: 2,
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      to: '/search',
      show: siteConfig('LAWN_MENU_SEARCH', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      to: '/archive',
      show: siteConfig('LAWN_MENU_ARCHIVE', null, CONFIG)
    }
    // { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: siteConfig('MENU_CATEGORY', null, CONFIG) },
    // { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: siteConfig('MENU_TAG', null, CONFIG) }
  ];

  if (customNav) {
    links = links.concat(customNav);
  }

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i;
    }
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu;
  }

  if (!links || links.length === 0) return;

  return (
    <>
      <nav className="leading-8 justify-center w-full flex">
        {links?.map((link, index) => link && link.show && <MenuItemDrop key={index} link={link} />)}
        {TRAVELLING_LINK && (
          <span className="pl-4 pr-2">
            <TravellingsLink />
          </span>
        )}
      </nav>
    </>
  );
};

export default MenuListTop;
