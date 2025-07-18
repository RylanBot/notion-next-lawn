import useDarkMode from '@/hooks/useDarkMode';
import useGlobal from '@/hooks/useGlobal';

import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';

export default function FloatDarkModeButton() {
  const { locale } = useGlobal();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  if (!siteConfig('LAWN_WIDGET_DARK_MODE', null, CONFIG)) return <></>;

  return (
    <div className="group right-float-tooltip-parent">
      <i className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas text-xs`} onClick={toggleDarkMode} />
      <span className="right-float-tooltip -left-[17px]">
        {`${isDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE}`}
      </span>
    </div>
  );
}
