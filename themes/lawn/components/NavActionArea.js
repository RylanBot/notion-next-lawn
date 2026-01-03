import { siteConfig } from '@/libs/common/config';
import { TravellingsButton } from '@/plugins/base/TravellingsLink';

import DarkModeButton from './DarkModeButton';

const NavActionArea = () => {
  const TRAVELLING_LINK = siteConfig('TRAVELLING_LINK');

  return (
    <div className="flex justify-center items-center gap-6">
      <DarkModeButton />
      {TRAVELLING_LINK && <TravellingsButton />}
    </div>
  );
};

export default NavActionArea;
