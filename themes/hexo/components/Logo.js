import { siteConfig } from '@/lib/config';
import Link from 'next/link';

/**
 * 站点标题
 */
const Logo = props => {
  return (
    <Link href='/' passHref legacyBehavior>
      <div className='flex flex-col justify-center items-center cursor-pointer space-y-3'>
        <div className='italic font-medium text-2xl p-1.5 rounded dark:border-white menu-link transform duration-200 menu-title'>
          {siteConfig('TITLE')}
        </div>
      </div>
    </Link>
  );
};
export default Logo;
