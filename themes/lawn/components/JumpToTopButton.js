import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/lib/config';

import CONFIG from '../config';

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 */
const JumpToTopButton = ({ showPercent = true, percent }) => {
  const { locale } = useGlobal();

  if (!siteConfig('LAWN_WIDGET_TO_TOP', null, CONFIG)) {
    return <></>;
  }

  return (
    <div className="space-x-1 items-center justify-center w-7 h-auto text-center">
      <div className="group right-float-tooltip-parent">
        <i onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fas fa-arrow-up text-xs" />
        <span className="right-float-tooltip -left-2">{locale.POST.TOP}</span>
      </div>
      {showPercent && <div className="text-xs hidden lg:block">{percent}</div>}
    </div>
  );
};

export default JumpToTopButton;
