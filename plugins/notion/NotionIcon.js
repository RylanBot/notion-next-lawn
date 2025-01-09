import LazyImage from '../base/LazyImage'

/**
 * notion 的图标
 * 可能是 emoji 可能是 svg 也可能是图片
 */
const NotionIcon = ({ icon }) => {
  if (!icon) {
    return <></>
  }

  if (icon.startsWith('http') || icon.startsWith('data:')) {
    return <LazyImage src={icon} className='w-8 h-8 my-auto inline mr-1'/>
  }

  return <span className='mr-1'>{icon}</span>
}

export default NotionIcon
