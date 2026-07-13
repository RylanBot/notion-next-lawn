import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import LazyImage from '@/plugins/base/LazyImage';

import SocialButton from './SocialButton';

const ProfileInfo = () => {
  const { siteInfo } = useGlobal();

  const AUTHOR = siteConfig('AUTHOR');
  const BIO = siteConfig('BIO');

  return (
    <div className="py-4 text-center">
      <div className="flex justify-center items-center pt-1">
        <LazyImage
          src={siteInfo?.icon}
          alt={AUTHOR}
          priority={true}
          fetchpriority="high"
          className="w-28 h-28 rounded-full bg-white border-4 border-white dark:bg-zinc-900 dark:border-zinc-900 shadow-md"
        />
      </div>

      <h2 className="font-medium text-2xl my-2 dark:text-gray-300">{AUTHOR}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{BIO}</p>

      <SocialButton />
    </div>
  );
};

export default ProfileInfo;
