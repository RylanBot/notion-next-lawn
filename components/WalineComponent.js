import { useRouter } from 'next/router'
import { createRef, useEffect } from 'react'

import { init } from '@waline/client'
import '@waline/client/dist/waline.css'

import { siteConfig } from '@/lib/config'
import { loadLangFromCookies } from '@/lib/lang'

let waline = null
let controller = null

const WalineComponent = props => {
  const containerRef = createRef()
  const router = useRouter()

  const updateWaline = url => {
    if (url !== '' && waline) {
      waline.update(props)
    }
  }

  useEffect(() => {
    const initWaline = () => {
      if (waline) {
        waline.destroy()
      }

      controller = new AbortController()
      waline = init({
        ...props,
        el: containerRef.current,
        serverURL: siteConfig('COMMENT_WALINE_SERVER_URL'),
        lang: loadLangFromCookies(),
        locale: {
          reactionTitle: '',
          placeholder: ''
        },
        reaction: [
          'https://s2.loli.net/2024/04/03/PmDLpdZNf3b1YK2.png', // fish
          'https://s2.loli.net/2024/04/03/9idwY84afBRrkmU.png', // bear
          'https://s2.loli.net/2024/04/03/Zkq29DXepMOrS5t.png', // wine
          'https://s2.loli.net/2024/04/04/9ZfQkLrMRdB2lzi.png', // flower
          'https://s2.loli.net/2024/04/04/brJgseL7RZ5mV4E.png' // leaf
        ],
        dark: 'html.dark',
        emoji: [
          '//npm.elemecdn.com/@waline/emojis@1.1.0/weibo',
          '//npm.elemecdn.com/@waline/emojis@1.1.0/tieba',
          '//npm.elemecdn.com/@waline/emojis@1.1.0/bilibili'
        ],
        login: 'disable',
        search: false,
        imageUploader: false,
        requiredMeta: ['nick'],
        signal: controller.signal // 将信号传递给 Waline
      })
    }

    router.events.on('routeChangeStart', () => {
      if (controller) {
        controller.abort() // 中止正在进行的请求
      }
    })

    initWaline()

    return () => {
      if (waline) {
        waline.destroy()
        waline = null
      }
      router.events.off('routeChangeComplete', updateWaline)
    }
  }, [])

  return <div ref={containerRef} />
}

export default WalineComponent
