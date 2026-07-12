import ColorDots from './ColorDots';
import MenuListSide from './MenuListSide';
import NavActionArea from './NavActionArea';
import ProfileInfo from './ProfileInfo';

/**
 * 移动端侧边菜单
 */
const SideBar = (props) => {
  return (
    <div id="lawn-side-bar" className="relative overflow-hidden min-h-dvh">
      {/* 装饰圆点 */}
      <ColorDots />

      {/* 内容 */}
      <div className="relative h-full py-6">
        <ProfileInfo />

        <MenuListSide {...props} />

        <div className="w-full absolute bottom-16">
          <NavActionArea />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
