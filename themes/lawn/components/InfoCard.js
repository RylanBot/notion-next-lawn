import { useRouter } from 'next/router';

import LazyImage from '@/plugins/LazyImage';
import { siteConfig } from '@/libs/common/config';

import Card from './Card';
// import MenuGroupCard from './MenuGroupCard';
import SocialButton from './SocialButton';

/**
 * 社交信息卡
 */
function InfoCard(props) {
  const { className, siteInfo } = props;

  const AUTHOR = siteConfig('AUTHOR');
  const BIO = siteConfig('BIO');

  const router = useRouter();
  const specialPath = [
    '/page/[page]',
    '/tag',
    '/tag/[tag]',
    '/category',
    '/category/[category]',
    '/archive',
    '/search',
    '/404'
  ];

  return (
    <div className={`max-md:hidden ${specialPath.includes(router.pathname) ? 'md:pt-14' : ''}`}>
      <Card className={className}>
        <div className="flex justify-center items-center py-4">
          <LazyImage
            src={siteInfo?.icon}
            alt={AUTHOR}
            priority={true}
            fetchpriority="high"
            className="rounded-full w-36 h-36"
          />
        </div>
        <div className="font-oleo font-medium text-center text-2xl mb-3">{AUTHOR}</div>
        <div className="text-sm text-center mb-6">{BIO}</div>
        {/* <MenuGroupCard {...props} /> */}
        <SocialButton />
      </Card>
    </div>
  );
}

export default InfoCard;
