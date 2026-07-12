import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import LazyImage from '@/plugins/base/LazyImage';

import SocialButton from './SocialButton';

const ProfileInfo = () => {
  const { siteInfo } = useGlobal();

  const AUTHOR = siteConfig('AUTHOR');
  const BIO = siteConfig('BIO');

  return (
    <div className="py-4">
      <div className="flex justify-center items-center">
        <LazyImage
          src={siteInfo?.icon}
          alt={AUTHOR}
          priority={true}
          fetchpriority="high"
          className="w-28 h-28 rounded-full bg-white border-4 border-white dark:bg-zinc-900 dark:border-zinc-900 shadow-md"
        />
      </div>

      <h2 className="font-times font-medium text-center text-2xl my-2 dark:text-gray-300">{AUTHOR}</h2>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">{BIO}</p>

      <SocialButton />
    </div>
  );
};

export default ProfileInfo;
