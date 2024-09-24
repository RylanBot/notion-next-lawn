import Link from 'next/link';
import { siteConfig } from '@/lib/config';

/**
 * 站点标题
 */
const Logo = () => {
  return (
    <Link href="/" passHref legacyBehavior>
      <div className="flex flex-col justify-center items-center cursor-pointer space-y-3">
        <div className="italic font-bold text-2xl p-1.5 transform duration-200 rainbow-text">{siteConfig('TITLE')}</div>
      </div>
    </Link>
  );
};
export default Logo;
