import { useImperativeHandle } from 'react';
import useDarkMode from '@/hooks/useDarkMode';

/**
 * 深色模式按钮
 */
const DarkModeButton = (props) => {
  const { cRef } = props;
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // 对外暴露方法
  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        toggleDarkMode();
      }
    };
  });

  return (
    <div onClick={toggleDarkMode} className={`flex justify-center dark:text-gray-200 text-gray-800`}>
      <div id="darkModeButton" className="hover:scale-110 cursor-pointer transform duration-200 w-5 h-5">
        <i className={`fa-solid fa-${isDarkMode ? 'sun' : 'moon'}`} />
      </div>
    </div>
  );
};

export default DarkModeButton;
