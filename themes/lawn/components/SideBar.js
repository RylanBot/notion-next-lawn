import LazyImage from '@/plugins/base/LazyImage';
import { siteConfig } from '@/libs/common/config';

// import MenuGroupCard from './MenuGroupCard';
import MenuListSide from './MenuListSide';
import SocialButton from './SocialButton';

/**
 * 移动端侧边菜单
 */
const SideBar = (props) => {
  const { siteInfo } = props;

  const AUTHOR = siteConfig('AUTHOR');
  const BIO = siteConfig('BIO');

  return (
    <div id="lawn-side-bar">
      <div className="my-8 w-full">
        <div className="dark:text-gray-100">
          <div className="flex justify-center item-center mb-3">
            <LazyImage
              src={siteInfo?.icon}
              alt={AUTHOR}
              width={100}
              height={100}
              className="rounded-full w-28 h-28"
            />
          </div>
          <div className="font-oleo text-2xl font-medium text-center mb-1">{AUTHOR}</div>
          <div className="text-sm text-center mb-4">{BIO}</div>
          <SocialButton />
        </div>
        {/* <MenuGroupCard {...props} /> */}
      </div>
      <MenuListSide {...props} />
    </div>
  );
};

export default SideBar;
