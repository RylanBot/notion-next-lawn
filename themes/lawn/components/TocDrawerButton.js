import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';

/**
 * 移动端目录抽屉
 */
const TocDrawerButton = props => {
  if (!siteConfig('LAWN_WIDGET_TOC', null, CONFIG)) {
    return <></>
  }
  return (
    <div onClick={props.onClick}
      className="cursor-pointer transform duration-200 flex justify-center items-center text-center lg:hidden"
    >
      <i className="fas fa-list-ol text-xs" />
    </div>
  )
}

export default TocDrawerButton
