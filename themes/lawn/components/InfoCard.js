import clsx from 'clsx';

import ColorDots from './ColorDots';
import ProfileInfo from './ProfileInfo';

/**
 * 社交信息卡
 */
function InfoCard({ className, width, ...props }) {
  return (
    <div className={clsx(width, className)}>
      <div className="relative overflow-hidden rounded-xl border border-teal-800/40 bg-stone-50 shadow-xl dark:border-teal-400/30 dark:bg-zinc-900">
        <ColorDots />
        <div className="relative h-full">
          <ProfileInfo {...props} />
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
