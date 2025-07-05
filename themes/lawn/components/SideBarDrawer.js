import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * 侧边栏抽屉面板
 */
const SideBarDrawer = ({ children, isOpen, onOpen, onClose, className }) => {
  const router = useRouter();

  const switchSideDrawerVisible = (showStatus) => {
    if (showStatus) {
      onOpen && onOpen();
    } else {
      onClose && onClose();
    }

    const sideBarDrawer = window.document.getElementById('lawn-sidebar-drawer');
    const sideBarDrawerBackground = window.document.getElementById('lawn-sidebar-drawer-background');

    if (showStatus) {
      sideBarDrawer?.classList.replace('-mr-72', 'mr-0');
      sideBarDrawerBackground?.classList.replace('hidden', 'block');
    } else {
      sideBarDrawer?.classList.replace('mr-0', '-mr-72');
      sideBarDrawerBackground?.classList.replace('block', 'hidden');
    }
  };

  useEffect(() => {
    const sideBarDrawerRouteListener = () => {
      switchSideDrawerVisible(false);
    };
    router.events.on('routeChangeComplete', sideBarDrawerRouteListener);
    return () => {
      router.events.off('routeChangeComplete', sideBarDrawerRouteListener);
    };
  }, [router.events]);

  useEffect(() => {
    const handleScroll = (e) => {
      if (isOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener('touchmove', handleScroll, { passive: false });
      document.addEventListener('wheel', handleScroll, { passive: false });
    } else {
      document.removeEventListener('touchmove', handleScroll);
      document.removeEventListener('wheel', handleScroll);
    }

    return () => {
      document.removeEventListener('touchmove', handleScroll);
      document.removeEventListener('wheel', handleScroll);
    };
  }, [isOpen]);

  return (
    <div className={`block lg:hidden top-0 relative z-50 ${className || ''}`}>
      <div
        id="lawn-sidebar-drawer"
        className={`${
          isOpen ? 'mr-0 w-72 visible' : '-mr-72 max-w-side invisible'
        } bg-gray-50 right-0 top-0 dark:bg-lawn-black-gray shadow-black shadow-lg flex flex-col duration-300 fixed h-full overflow-y-scroll scroll-hidden z-30`}
      >
        {children}
      </div>

      {/* 背景蒙版 */}
      <div
        id="lawn-sidebar-drawer-background"
        className={`${
          isOpen ? 'block' : 'hidden'
        } animate__animated animate__fadeIn fixed top-0 duration-300 left-0 z-20 w-full h-full bg-black/70`}
        onClick={() => {
          switchSideDrawerVisible(false);
        }}
      />
    </div>
  );
};
export default SideBarDrawer;
