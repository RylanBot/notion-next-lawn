/* eslint-disable react/no-unknown-property */

import { siteConfig } from '@/lib/config'
import useAdjustStyle from '@/hooks/useAdjustStyle'

/**
 * 这里的css样式对全局生效
 * 主题客制化css
 * @returns
 */
const GlobalStyle = () => {
  // 一些需要利用 js 调整的样式，可以统一放入该钩子进行调整
  useAdjustStyle();

  // 从NotionConfig中读取样式
  const GLOBAL_CSS = siteConfig('GLOBAL_CSS')

  return (
    <style jsx global>{`${GLOBAL_CSS}`}</style>
  )
}

export { GlobalStyle }
