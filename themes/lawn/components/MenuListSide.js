import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';
import MenuItemCollapse from './MenuItemCollapse';

const MenuListSide = (props) => {
  const { customNav, customMenu } = props;
  const { locale } = useGlobal();

  const LAWN_MENU_ARCHIVE = siteConfig('LAWN_MENU_ARCHIVE', null, CONFIG);
  const LAWN_MENU_SEARCH = siteConfig('LAWN_MENU_SEARCH', null, CONFIG);
  const LAWN_MENU_CATEGORY = siteConfig('LAWN_MENU_CATEGORY', null, CONFIG);
  const LAWN_MENU_TAG = siteConfig('LAWN_MENU_TAG', null, CONFIG);
  const CUSTOM_MENU = siteConfig('CUSTOM_MENU');

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      to: '/archive',
      show: LAWN_MENU_ARCHIVE
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      to: '/search',
      show: LAWN_MENU_SEARCH
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      to: '/category',
      show: LAWN_MENU_CATEGORY
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      to: '/tag',
      show: LAWN_MENU_TAG
    }
  ];

  if (customNav) {
    links = customNav.concat(links);
  }

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i;
    }
  }

  // 如果开启自定义菜单，则覆盖 Page 生成的菜单
  if (CUSTOM_MENU) links = customMenu;

  if (!links || links.length === 0) return;

  return (
    <nav>
      {links?.map((link, index) => (
        <MenuItemCollapse key={index} link={link} />
      ))}
    </nav>
  );
};

export default MenuListSide;
