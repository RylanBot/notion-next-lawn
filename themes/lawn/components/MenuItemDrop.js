import Link from 'next/link';
import { useState } from 'react';

const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false);
  const hasSubMenu = link?.subMenus?.length > 0;

  if (!link || !link.show) return null;

  return (
    <div onMouseOver={() => changeShow(true)} onMouseOut={() => changeShow(false)}>
      {!hasSubMenu && (
        <Link
          href={link?.to}
          className="menu-title pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest pb-1"
        >
          {link?.icon && <i className={link?.icon} />} {link?.name}
          {hasSubMenu && <i className="px-2 fa fa-angle-down"></i>}
        </Link>
      )}

      {hasSubMenu && (
        <>
          <div className="cursor-pointer menu-title pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest pb-1">
            {link?.icon && <i className={link?.icon} />} {link?.name}
            <i className={`px-2 fa fa-angle-down duration-300  ${show ? 'rotate-180' : 'rotate-0'}`}></i>
          </div>
        </>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          className={`${show ? 'visible opacity-100 top-12' : 'invisible opacity-0 top-20'} drop-shadow-md overflow-hidden rounded-md bg-white transition-all duration-300 z-20 absolute block`}
          style={{ backdropFilter: 'blur(3px)' }}
        >
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className="cursor-pointer hover:bg-teal-400 text-gray-900 hover:text-black tracking-widest transition-all duration-200 dark:border-gray-800 py-1 pr-6 pl-3"
              >
                <Link href={sLink.to}>
                  <span className="text-sm text-nowrap font-extralight">
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MenuItemDrop;
