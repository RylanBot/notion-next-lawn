import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';
import MenuItemDrop from './MenuItemDrop';

const MenuListTop = (props) => {
  const { customNav, customMenu } = props;
  const { locale } = useGlobal();

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
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      to: '/archive',
      show: siteConfig('LAWN_MENU_ARCHIVE', null, CONFIG)
    }
  ];

  if (customNav) {
    links = links.concat(customNav);
  }

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i;
    }
  }

  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu;
  }

  if (!links || links.length === 0) return;

  return (
    <nav className="flex items-center gap-1">
      {links?.map((link, index) => link && link.show && <MenuItemDrop key={index} link={link} />)}
    </nav>
  );
};

export default MenuListTop;
