import * as React from 'react'
import { getBlockTitle } from 'notion-utils'
import Katex from '@/components/KatexReact'

const katexSettings = {
  throwOnError: false,
  strict: false
}

/**
 * 数学公式
 */
export const Equation = ({ block, math, inline = false, className, ...rest }) => {
  math = math || getBlockTitle(block, null)
  if (!math) return null

  return (
    <span
      role='button'
      tabIndex={0}
      className={`notion-equation ${inline ? 'notion-equation-inline' : 'notion-equation-block'}`}
    >
      <Katex math={math} settings={katexSettings} {...rest} />
    </span>
  )
}
