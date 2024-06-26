import TravellingsLink from '@/components/TravellingsLink';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';
import { MenuItemCollapse } from './MenuItemCollapse';

export const MenuListSide = (props) => {
  const { customNav, customMenu } = props;
  const { locale } = useGlobal();

  let links = [
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: siteConfig('LAWN_MENU_ARCHIVE', null, CONFIG) },
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: siteConfig('LAWN_MENU_SEARCH', null, CONFIG) },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: siteConfig('LAWN_MENU_CATEGORY', null, CONFIG) },
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

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu;
  }

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <nav id='nav-mobile' >
      <div className='pr-1'>
        {links?.map((link, index) => <MenuItemCollapse key={index} link={link} />)}
      </div>
      <div className="w-full px-10 tracking-widest flex justify-center align-bottom absolute bottom-4">
        <TravellingsLink />
      </div>
    </nav>
  );
};
