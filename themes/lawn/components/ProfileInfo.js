import clsx from 'clsx';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import LazyImage from '@/plugins/base/LazyImage';

import SocialButton from './SocialButton';

const ProfileInfo = ({ align = 'left' }) => {
  const { siteInfo } = useGlobal();
  const centered = align === 'center';

  const AUTHOR = siteConfig('AUTHOR');
  const BIO = siteConfig('BIO');

  return (
    <div className={clsx('px-8 py-8', centered ? 'text-center' : 'text-left')}>
      <div className={clsx('flex items-center', centered ? 'justify-center' : 'justify-start')}>
        <div className="rounded-full border border-dashed border-teal-900 p-1 dark:border-amber-50">
          <LazyImage
            priority
            src={siteInfo?.icon}
            alt={AUTHOR}
            className="h-20 w-20 rounded-full bg-stone-50 object-cover dark:bg-zinc-900"
          />
        </div>
      </div>

      <h2 className="mt-5 font-semibold text-xl text-zinc-900 dark:text-amber-50">{AUTHOR}</h2>
      <p
        className={clsx(
          'mb-6 mt-2 max-w-64 text-sm leading-relaxed text-stone-500 dark:text-zinc-400',
          centered && 'mx-auto'
        )}
      >
        {BIO}
      </p>

      <SocialButton align={align} />
    </div>
  );
};

export default ProfileInfo;
