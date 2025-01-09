import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import TravellingsLink from '@/plugins/base/TravellingsLink';

import CONFIG from '../config';
import MenuItemCollapse from './MenuItemCollapse';

const MenuListSide = (props) => {
  const { customNav, customMenu } = props;
  const { locale } = useGlobal();

  const CUSTOM_MENU = siteConfig('CUSTOM_MENU');
  const TRAVELLING_LINK = siteConfig('TRAVELLING_LINK');

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      to: '/archive',
      show: siteConfig('LAWN_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      to: '/search',
      show: siteConfig('LAWN_MENU_SEARCH', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      to: '/category',
      show: siteConfig('LAWN_MENU_CATEGORY', null, CONFIG)
    },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: siteConfig('LAWN_MENU_TAG', null, CONFIG) }
  ];

  if (customNav) {
    links = customNav.concat(links);
  }

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i;
    }
  }

  // 如果 开启自定义菜单，则覆盖 Page 生成的菜单
  if (CUSTOM_MENU) links = customMenu;

  if (!links || links.length === 0) return <></>;

  return (
    <nav id="nav-mobile">
      <div className="pr-1">
        {links?.map((link, index) => (
          <MenuItemCollapse key={index} link={link} />
        ))}
      </div>

      {TRAVELLING_LINK && (
        <div className="w-full px-10 tracking-widest flex justify-center align-bottom absolute bottom-4">
          <TravellingsLink />
        </div>
      )}
    </nav>
  );
};

export default MenuListSide;
