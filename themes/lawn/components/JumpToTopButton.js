import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 */
const JumpToTopButton = () => {
  const { locale } = useGlobal();

  if (!siteConfig('LAWN_WIDGET_TO_TOP', null, CONFIG)) {
    return <></>;
  }

  return (
    <div className="group right-float-tooltip-parent">
      <i onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fas fa-arrow-up text-xs" />
      <span className="right-float-tooltip -left-4">{locale.POST.TOP}</span>
    </div>
  );
};

export default JumpToTopButton;
