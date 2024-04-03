import { useRouter } from 'next/router';
import { createRef, useEffect } from 'react';

import { init } from '@waline/client';
import '@waline/client/dist/waline.css';

import { siteConfig } from '@/lib/config';
import { loadLangFromCookies } from '@/lib/lang';

const path = '';
let waline = null;
/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const WalineComponent = (props) => {
  const containerRef = createRef();
  const router = useRouter();

  const updateWaline = url => {
    if (url !== path && waline) {
      waline.update(props);
    }
  };

  useEffect(() => {
    if (!waline) {
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
        requiredMeta: ['nick']
      });
    }

    // 跳转评论
    router.events.on('routeChangeComplete', updateWaline);
    const anchor = window.location.hash;
    if (anchor) {
      // 选择需要观察变动的节点
      const targetNode = document.getElementsByClassName('wl-cards')[0];

      // 当观察到变动时执行的回调函数
      const mutationCallback = (mutations) => {
        for (const mutation of mutations) {
          const type = mutation.type;
          if (type === 'childList') {
            const anchorElement = document.getElementById(anchor.substring(1));
            if (anchorElement && anchorElement.className === 'wl-item') {
              anchorElement.scrollIntoView({ block: 'end', behavior: 'smooth' });
              setTimeout(() => {
                anchorElement.classList.add('animate__animated');
                anchorElement.classList.add('animate__bounceInRight');
                observer.disconnect();
              }, 300);
            }
          }
        }
      };

      // 观察子节点变化
      const observer = new MutationObserver(mutationCallback);
      observer.observe(targetNode, { childList: true });
    }

    return () => {
      if (waline) {
        waline.destroy();
        waline = null;
      }
      router.events.off('routeChangeComplete', updateWaline);
    };
  }, []);

  return <div ref={containerRef} />;
};

export default WalineComponent;
