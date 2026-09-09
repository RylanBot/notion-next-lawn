import Link from 'next/link';

import { siteConfig } from '@/libs/common/config';

/**
 * 站点标题
 */
const Logo = () => {
  const TITLE = siteConfig('TITLE');

  return (
    <Link href="/" className="block [perspective:800px]">
      <span className="relative flex h-7 items-center justify-center transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]">
        <span className=" text-xl tracking-wide text-zinc-900 [backface-visibility:hidden] dark:text-white">
          {TITLE}
        </span>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-md tracking-wide text-teal-700 [backface-visibility:hidden] [transform:rotateX(180deg)] dark:text-teal-400">
          <i className="fas fa-house text-base" aria-hidden />
        </span>
      </span>
    </Link>
  );
};

export default Logo;
