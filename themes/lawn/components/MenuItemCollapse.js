import Link from 'next/link';
import { useState } from 'react';

import Collapse from '@/plugins/base/Collapse';

/**
 * 折叠菜单
 */
const MenuItemCollapse = (props) => {
  const { link } = props;
  const [show, changeShow] = useState(false);
  const hasSubMenu = link?.subMenus?.length > 0;

  const [isOpen, changeIsOpen] = useState(false);

  const toggleShow = () => {
    changeShow(!show);
  };

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen);
  };

  if (!link || !link.show) {
    return null;
  }

  return (
    <>
      <div className="w-full px-8 py-2 text-lg text-left dark:bg-lawn-black-gray" onClick={toggleShow}>
        {!hasSubMenu && (
          <Link
            className="font-extralight flex justify-between pl-2 pr-4 dark:text-gray-200 no-underline tracking-widest pb-1"
            href={link?.to}
            target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
          >
            <div className="transition-all flex justify-center items-center duration-200 space-x-4">
              {link?.icon && <i className={link.icon} />}
              <span>{link?.name}</span>
            </div>
          </Link>
        )}
        {hasSubMenu && (
          <div
            onClick={hasSubMenu ? toggleOpenSubMenu : null}
            className="font-extralight flex items-center justify-between pl-2 pr-4 cursor-pointer  dark:text-gray-200 no-underline tracking-widest pb-1"
          >
            <span className="transition-all items-center duration-200">
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
            <i
              className={`px-2 fas fa-chevron-left transition-all duration-200 ${
                isOpen ? '-rotate-90' : ''
              } text-gray-400`}
            ></i>
          </div>
        )}
      </div>

      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={props.onHeightChange}>
          {link.subMenus.map((sLink, index) => {
            return (
              <div
                key={index}
                className="dark:bg-black dark:text-gray-200 text-left px-10 justify-start bg-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200  py-3 pr-6"
              >
                <Link href={sLink.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}>
                  <span className="text-sm ml-4 whitespace-nowrap">
                    {link?.icon && <i className={sLink.icon + ' mr-2'} />} {sLink.title}
                  </span>
                </Link>
              </div>
            );
          })}
        </Collapse>
      )}
    </>
  );
};

export default MenuItemCollapse;
