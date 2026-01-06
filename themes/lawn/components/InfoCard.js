import { siteConfig } from '@/libs/common/config';
import LazyImage from '@/plugins/base/LazyImage';

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

  return (
    <div className={`max-xl:hidden ${className || ''}`}>
      <Card>
        <div className="flex justify-center items-center py-2">
          <LazyImage
            src={siteInfo?.icon}
            alt={AUTHOR}
            priority={true}
            fetchpriority="high"
            className="rounded-full w-28 h-28"
          />
        </div>
        <div className="font-times font-medium text-center text-2xl mb-2">{AUTHOR}</div>
        <div className="text-sm text-center mb-4">{BIO}</div>
        {/* <MenuGroupCard {...props} /> */}
        <SocialButton />
      </Card>
    </div>
  );
}

export default InfoCard;
