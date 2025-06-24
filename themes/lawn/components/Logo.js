import Link from 'next/link';
import { siteConfig } from '@/libs/common/config';

/**
 * 站点标题
 */
const Logo = () => {
  const TITLE = siteConfig('TITLE');
  return (
    <Link passHref href="/">
      <div className="flex flex-col justify-center items-center cursor-pointer space-y-3">
        <div className="font-bold tracking-wide text-2xl p-1.5 transform duration-200 rainbow-text">{TITLE}</div>
      </div>
    </Link>
  );
};
export default Logo;
