import LazyImage from '@/components/LazyImage';
import { siteConfig } from '@/lib/config';
// import MenuGroupCard from './MenuGroupCard';
import { MenuListSide } from './MenuListSide';
import SocialButton from './SocialButton';

/**
 * 移动端侧边菜单
 */
const SideBar = (props) => {
  const { siteInfo } = props;
  return (
    <div id="lawn-side-bar">
      <div className="my-8 w-full">
        <div className="dark:text-gray-100">
          <div className="flex justify-center item-center mb-3">
            <LazyImage src={siteInfo?.icon} className="rounded-full" width={85} alt={siteConfig('AUTHOR')} />
          </div>
          <div className="font-medium text-center mb-2">{siteConfig('AUTHOR')}</div>
          <div className="text-sm text-center mb-3">{siteConfig('BIO')}</div>
          <SocialButton />
        </div>
        {/* <MenuGroupCard {...props} /> */}
      </div>
      <MenuListSide {...props} />
    </div>
  );
};

export default SideBar;
