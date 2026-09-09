import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import clsx from 'clsx';

const isActiveLink = (pathname, asPath, to) => {
  if (!to) return false;
  if (to === '/') return pathname === '/';
  return asPath === to || asPath.startsWith(`${to}/`);
};

const MenuItemDrop = ({ link }) => {
  const router = useRouter();
  const [show, changeShow] = useState(false);
  const hasSubMenu = link?.subMenus?.length > 0;
  const active = isActiveLink(router.pathname, router.asPath, link?.to);

  if (!link || !link.show) return null;

  const pillClass = clsx(
    'inline-flex items-center rounded-full px-4 py-1.5 text-sm tracking-wide transition-colors',
    active ? 'bg-teal-700 text-white' : 'text-teal-900 hover:bg-teal-900/10 dark:text-white dark:hover:bg-white/10'
  );

  return (
    <div className="relative" onMouseOver={() => changeShow(true)} onMouseOut={() => changeShow(false)}>
      {!hasSubMenu && (
        <Link href={link?.to} className={pillClass}>
          {link?.icon && <i className={`${link.icon} mr-1.5 text-sm`} />}
          {link?.name}
        </Link>
      )}

      {hasSubMenu && (
        <div className={clsx(pillClass, 'cursor-pointer')}>
          {link?.icon && <i className={`${link.icon} mr-1.5 text-sm`} />}
          {link?.name}
          <i className={`fa fa-angle-down pl-1.5 text-xs duration-300 ${show ? 'rotate-180' : 'rotate-0'}`}></i>
        </div>
      )}

      {hasSubMenu && (
        <ul
          className={clsx(
            'absolute left-1/2 z-20 mt-2 min-w-40 -translate-x-1/2 overflow-hidden rounded-2xl border border-teal-900/15 bg-stone-50 py-1 shadow-lg transition-all duration-300 dark:border-white/15 dark:bg-zinc-900',
            show ? 'visible top-full opacity-100' : 'invisible top-full opacity-0'
          )}
        >
          {link.subMenus.map((sLink, index) => (
            <li key={index}>
              <Link
                href={sLink.to}
                className="block px-4 py-2 text-sm text-teal-900 transition-colors hover:bg-teal-700/10 dark:text-white"
              >
                {sLink?.icon && <i className={`${sLink.icon} mr-2`} />}
                {sLink.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MenuItemDrop;
