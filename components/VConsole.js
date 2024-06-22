import { loadExternalResource, isMobile } from '@/lib/utils'
import { useEffect, useRef } from 'react'

/**
 * 移动端调试工具
 * 在窗口中心快速连续点击8次后会出现
 */
const VConsole = () => {
  const clickCountRef = useRef(0)
  const lastClickTimeRef = useRef()
  const timerRef = useRef()

  const loadVConsole = async () => {
    try {
      const url = await loadExternalResource('https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js', 'js')
      if (!url) return

      const VConsole = window.VConsole
      const vConsole = new VConsole()
      return vConsole
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if(!isMobile()) return

    const clickListener = (event) => {
      const now = Date.now()
      // 只监听窗口中心的100x100像素范围内的单击事件
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const range = 50
      const inRange = (event.clientX >= centerX - range && event.clientX <= centerX + range) &&
                      (event.clientY >= centerY - range && event.clientY <= centerY + range)

      if (!inRange) {
        return
      }

      // 如果在1秒内连续点击了8次
      if (now - lastClickTimeRef.current < 1000 && clickCountRef.current + 1 === 8) {
        loadVConsole()
        clickCountRef.current = 0 // 重置计数器
        clearTimeout(timerRef.current) // 清除定时器
        window.removeEventListener('click', clickListener)
      } else {
        // 如果不满足条件，则重新设置时间戳和计数器
        lastClickTimeRef.current = now
        clickCountRef.current += 1
        // 如果计数器不为0，则设置定时器
        if (clickCountRef.current > 0) {
          clearTimeout(timerRef.current)
          timerRef.current = setTimeout(() => {
            clickCountRef.current = 0
          }, 1000)
        }
      }
    }

    window.addEventListener('click', clickListener)
    return () => {
      window.removeEventListener('click', clickListener)
      clearTimeout(timerRef.current)
    }
  }, [])

  return null
}

export default VConsole
