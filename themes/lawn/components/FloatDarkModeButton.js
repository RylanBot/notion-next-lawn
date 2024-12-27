import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';
import CONFIG from '../config';

export default function FloatDarkModeButton() {
  const { locale, isDarkMode, toggleDarkMode } = useGlobal();

  if (!siteConfig('LAWN_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>;
  }

  return (
    <div className="group right-float-tooltip-parent">
      <i
        id="darkModeButton"
        onClick={toggleDarkMode}
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas text-xs`}
      />
      <span className="right-float-tooltip -left-[17px]">
        {`${isDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE}`}
      </span>
    </div>
  );
}
