import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Prism from 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/toolbar/prism-toolbar.min.css';
// 以下插件依赖于 toolbar，必须放在后面调用
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/show-language/prism-show-language';

import useDarkMode from '@/hooks/useDarkMode';

import { siteConfig } from '@/libs/common/config';
import { loadExternalResource } from '@/libs/common/util';

/**
 * 代码美化
 */
const usePrism = () => {
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  const PRISM_AUTO_LOADER = siteConfig('PRISM_JS_AUTO_LOADER');
  const PRISM_PATH = siteConfig('PRISM_JS_PATH');
  const PRISM_PREFIX = siteConfig('PRISM_THEME_PREFIX_PATH');

  const PRISM_THEME_SWITCH = siteConfig('PRISM_THEME_SWITCH');
  const PRISM_DARK = siteConfig('PRISM_THEME_DARK_PATH');
  const PRISM_LIGHT = siteConfig('PRISM_THEME_LIGHT_PATH');

  const CODE_MAC_BAR = siteConfig('CODE_MAC_BAR');
  const CODE_LINE_NUMBER = siteConfig('CODE_LINE_NUMBERS');
  const CODE_COLLAPSE = siteConfig('CODE_COLLAPSE');
  const CODE_COLLAPSE_DEFAULT = siteConfig('CODE_COLLAPSE_EXPAND_DEFAULT');

  const MERMAID_CDN = siteConfig('MERMAID_CDN');

  const highlightAllUnder = (el) => {
    if (window?.Prism?.plugins?.autoloader) {
      window.Prism.plugins.autoloader.languages_path = PRISM_PATH;
    }
    Prism.highlightAllUnder(el);
  };

  const initPrism = async () => {
    // 加载脚本
    loadPrismThemeCSS(isDarkMode, PRISM_THEME_SWITCH, PRISM_DARK, PRISM_LIGHT, PRISM_PREFIX);

    loadExternalResource(PRISM_AUTO_LOADER, 'js').then(() => {
      if (window?.Prism?.plugins?.autoloader) {
        window.Prism.plugins.autoloader.languages_path = PRISM_PATH;
      }

      // 代码高亮
      const articleEl = document.querySelector('#notion-article');
      highlightAllUnder(articleEl);

      loadMermaid(MERMAID_CDN);

      /* ----- 额外插件 ----- */
      if (CODE_MAC_BAR) {
        loadExternalResource('/css/prism-mac-style.css', 'css').then(() => {
          renderMacStyle();
        });
      }

      if (CODE_LINE_NUMBER) {
        renderLineNumber();
      }

      if (CODE_COLLAPSE) {
        renderCollapseCode(CODE_COLLAPSE_DEFAULT);
      }
    });
  };

  useEffect(() => {
    initPrism();
  }, [router, isDarkMode]);

  return {
    highlightAllUnder
  };
};

const loadPrismThemeCSS = (
  isDarkMode,
  prismThemeSwitch,
  prismThemeDarkPath,
  prismThemeLightPath,
  prismThemePrefixPath
) => {
  let PRISM_THEME, PRISM_PREVIOUS;
  if (prismThemeSwitch) {
    if (isDarkMode) {
      PRISM_THEME = prismThemeDarkPath;
      PRISM_PREVIOUS = prismThemeLightPath;
    } else {
      PRISM_THEME = prismThemeLightPath;
      PRISM_PREVIOUS = prismThemeDarkPath;
    }
    const previousTheme = document.querySelector(`link[href="${PRISM_PREVIOUS}"]`);
    if (previousTheme?.parentNode?.contains(previousTheme)) {
      previousTheme.parentNode.removeChild(previousTheme);
    }
    loadExternalResource(PRISM_THEME, 'css');
  } else {
    loadExternalResource(prismThemePrefixPath, 'css');
  }
};

const loadMermaid = async (mermaidCDN) => {
  const observer = new MutationObserver(async (mutationsList) => {
    for (const m of mutationsList) {
      if (m.target.className === 'notion-code language-mermaid') {
        const chart = m.target.querySelector('code')?.textContent;
        if (chart && !m.target.querySelector('.mermaid')) {
          const mermaidChart = document.createElement('pre');
          mermaidChart.className = 'mermaid';
          mermaidChart.innerHTML = chart;
          m.target.appendChild(mermaidChart);
        }

        const mermaidsSvg = document?.querySelectorAll('.mermaid');
        if (mermaidsSvg) {
          let needLoad = false;
          for (const e of mermaidsSvg) {
            if (e?.firstChild?.nodeName !== 'svg') {
              needLoad = true;
            }
          }
          if (needLoad) {
            loadExternalResource(mermaidCDN, 'js').then((url) => {
              setTimeout(() => {
                const mermaid = window.mermaid;
                mermaid?.initialize({
                  theme: 'neutral'
                });
                mermaid?.contentLoaded();
              }, 100);
            });
          }
        }
      }
    }
  });

  if (document.querySelector('#notion-article')) {
    observer.observe(document.querySelector('#notion-article'), { attributes: true, subtree: true });
  }
};

const renderCollapseCode = (expandDefault) => {
  const codeBlocks = document?.querySelectorAll('.code-toolbar');
  for (const codeBlock of codeBlocks) {
    if (codeBlock.closest('.collapse-wrapper')) {
      continue;
    }

    const code = codeBlock.querySelector('code');
    const language = code.getAttribute('class').match(/language-(\w+)/)[1];

    const collapseWrapper = document.createElement('div');
    collapseWrapper.className = 'collapse-wrapper w-full py-2';
    const panelWrapper = document.createElement('div');
    panelWrapper.className =
      'border dark:border-gray-600 rounded-md hover:border-teal-500 duration-200 transition-colors';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center px-4 py-2 cursor-pointer select-none';
    header.innerHTML = `<h3 class="text-lg font-medium">${language}</h3><svg class="transition-all duration-200 w-5 h-5 transform rotate-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" clip-rule="evenodd"/></svg>`;

    const panel = document.createElement('div');
    panel.className = 'invisible h-0 transition-transform duration-200 border-t border-gray-300';

    panelWrapper.appendChild(header);
    panelWrapper.appendChild(panel);
    collapseWrapper.appendChild(panelWrapper);

    if (codeBlock?.parentNode?.contains(codeBlock)) {
      codeBlock.parentNode.insertBefore(collapseWrapper, codeBlock);
      panel.appendChild(codeBlock);
    }

    function collapseCode() {
      panel.classList.toggle('invisible');
      panel.classList.toggle('h-0');
      panel.classList.toggle('h-auto');
      header.querySelector('svg').classList.toggle('rotate-180');
      panelWrapper.classList.toggle('border-gray-300');
    }

    // 点击后折叠展开代码
    header.addEventListener('click', collapseCode);
    // 是否自动展开
    if (expandDefault) {
      header.click();
    }
  }
};

const renderMacStyle = () => {
  const container = document?.getElementById('notion-article');
  const codeToolBars = container?.getElementsByClassName('code-toolbar');
  if (codeToolBars) {
    Array.from(codeToolBars).forEach((item) => {
      const existPreMac = item.getElementsByClassName('pre-mac');
      if (existPreMac.length < codeToolBars.length) {
        const preMac = document.createElement('div');
        preMac.classList.add('pre-mac');
        preMac.innerHTML = '<span></span><span></span><span></span>';
        item?.appendChild(preMac, item);
      }
    });
  }
};

const renderLineNumber = () => {
  /**
   * 行号样式在首次渲染或被 detail 折叠后行高判断错误
   * 在此手动 resize 计算
   */
  const fixCodeLineStyle = () => {
    const observer = new MutationObserver((mutationsList) => {
      for (const m of mutationsList) {
        if (m.target.nodeName === 'DETAILS') {
          const preCodes = m.target.querySelectorAll('pre.notion-code');
          for (const preCode of preCodes) {
            Prism.plugins.lineNumbers.resize(preCode);
          }
        }
      }
    });
    observer.observe(document.querySelector('#notion-article'), { attributes: true, subtree: true });
    setTimeout(() => {
      const preCodes = document.querySelectorAll('pre.notion-code');
      for (const preCode of preCodes) {
        Prism.plugins.lineNumbers.resize(preCode);
      }
    }, 10);
  };

  const container = document.getElementById('notion-article');
  const codeBlocks = container.getElementsByTagName('pre');
  if (codeBlocks) {
    Array.from(codeBlocks).forEach((item) => {
      if (!item.classList.contains('line-numbers')) {
        item.classList.add('line-numbers');
        item.style.whiteSpace = 'pre-wrap';
      }
    });
  }
  fixCodeLineStyle();
};

export default usePrism;
