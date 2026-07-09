import clsx from 'clsx';

// import MenuGroupCard from './MenuGroupCard';
import ColorDots from './ColorDots';
import ProfileInfo from './ProfileInfo';

/**
 * 社交信息卡
 */
function InfoCard(props) {
  const { className } = props;

  return (
    <div className={clsx('max-xl:hidden', className)}>
      <div className="relative overflow-hidden p-0 rounded-md bg-white dark:bg-lawn-black-gray shadow-sm">
        {/* 装饰圆点 */}
        <ColorDots />

        {/* 内容层 */}
        <div className="relative h-full">
          <ProfileInfo />

          {/* <MenuGroupCard {...props} /> */}
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
