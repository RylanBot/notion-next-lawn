import clsx from 'clsx';

import { siteConfig } from '@/libs/common/config';
import { TravellingsButton } from '@/plugins/base/TravellingsLink';

import DarkModeButton from './DarkModeButton';

const NavActionArea = ({ className }) => {
  const TRAVELLING_LINK = siteConfig('TRAVELLING_LINK');

  return (
    <div className={clsx('flex items-center justify-center', className || 'gap-6')}>
      <DarkModeButton />
      {TRAVELLING_LINK && <TravellingsButton />}
    </div>
  );
};

export default NavActionArea;
