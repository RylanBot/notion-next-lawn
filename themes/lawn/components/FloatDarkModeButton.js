import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';
import CONFIG from '../config';

export default function FloatDarkModeButton() {
  const { isDarkMode, locale, updateDarkMode } = useGlobal();

  if (!siteConfig('LAWN_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>;
  }

  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode;
    updateDarkMode(newStatus);
    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark');
    htmlElement.classList?.add(newStatus ? 'dark' : 'light');
  };

  return (
    <div className="group right-float-tooltip-parent">
      <i
        id="darkModeButton"
        onClick={handleChangeDarkMode}
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas text-xs`}
      />
      <span className="right-float-tooltip -left-[17px]">
        {`${isDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE}`}
      </span>
    </div>
  );
}
