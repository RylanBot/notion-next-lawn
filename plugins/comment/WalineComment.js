import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { init } from '@waline/client';
import '@waline/client/style';

import useGlobal from '@/hooks/useGlobal';
import usePrism from '@/hooks/usePrism';

import { siteConfig } from '@/libs/common/config';
import { loadExternalResource } from '@/libs/common/util';

/**
 * @see https://waline.js.org/guide/get-started.html
 */
const WalineComment = (props) => {
  const router = useRouter();
  const { locale } = useGlobal();
  const { highlightAllUnder } = usePrism();

  const walineRef = useRef(null);
  const walineInstanceRef = useRef(null);
  const mountedRef = useRef(true);

  const [currentPath, setCurrentPath] = useState('');

  const LANG = siteConfig('LANG');
  const WALINE_SERVER_URL = siteConfig('COMMENT_WALINE_SERVER_URL');

  const safeWalineOps = {
    update: (params) => {
      if (mountedRef.current && walineInstanceRef.current) {
        try {
          walineInstanceRef.current.update(params);
        } catch (err) {
          console.warn('Waline update failed:', err);
        }
      }
    },
    destroy: () => {
      if (walineInstanceRef.current) {
        try {
          const instance = walineInstanceRef.current;
          walineInstanceRef.current = null;

          if (typeof instance.destroy === 'function') {
            instance.destroy();
          }
        } catch (err) {
          console.warn('Waline destruction failed', err);
          walineInstanceRef.current = null;
        }
      }
    }
  };

  const updateWaline = (url) => {
    if (url !== currentPath) {
      setCurrentPath(url);
      setTimeout(() => safeWalineOps.update(props), 50);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    loadExternalResource('/css/waline-custom.css', 'css');

    if (!walineInstanceRef.current && walineRef.current) {
      setCurrentPath(window.location.pathname);

      try {
        walineInstanceRef.current = init({
          ...props,
          el: walineRef.current,
          serverURL: WALINE_SERVER_URL,
          lang: LANG,
          locale: {
            reactionTitle: '',
            placeholder: locale.MAILCHIMP.COMMENT_PLACEHOLDER
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
          search: false,
          imageUploader: false,
          requiredMeta: ['nick'],
          highlighter: (code, lang) => {
            if (!window.Prism.languages[lang]) {
              window.Prism.plugins.autoloader.loadLanguages(lang);
            }
  
            return window.Prism.highlight(
              code,
              window.Prism.languages[lang] || window.Prism.languages.text,
              lang,
            );
          },
        });
      } catch (err) {
        console.error('Waline initialization failed', err);
      }
    }

    router.events.on('routeChangeComplete', updateWaline);
    return () => {
      mountedRef.current = false;
      router.events.off('routeChangeComplete', updateWaline);

      Promise.resolve().then(() => {
        if (!mountedRef.current) {
          safeWalineOps.destroy();
        }
      });
    };
  }, []);

  useEffect(() => {
    // 避免评论区代码高亮失败
    const commentEl = document.getElementById('comment');
    if (!commentEl) return;

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.classList.contains('wl-loading')) {
            // 评论加载完成
            const wlCountEl = commentEl.getElementsByClassName('wl-count')[0];
            if (!wlCountEl) return;

            // wl-count 后面的 wl-cards -> 实际的评论内容列表
            const preEls = Array.from(commentEl.querySelectorAll('pre'));
            preEls.forEach((pre) => {
              highlightAllUnder(pre);
            });
          }
        });
      });
    });

    observer.observe(commentEl, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={walineRef} />;
};

export default WalineComment;
