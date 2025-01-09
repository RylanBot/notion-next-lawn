import { useEffect } from 'react';

const useAdjustStyle = () => {
  // 避免 callout 含有图片时溢出撑开父容器
  useEffect(() => {
    const adjustCalloutImg = () => {
      const callOuts = document.querySelectorAll('.notion-callout-text');
      callOuts.forEach((callout) => {
        const images = callout.querySelectorAll('figure.notion-asset-wrapper.notion-asset-wrapper-image > div');
        const calloutWidth = callout.offsetWidth;
        images.forEach((container) => {
          const imageWidth = container.offsetWidth;
          if (imageWidth + 50 > calloutWidth) {
            container.style.setProperty('width', '100%');
          }
        });
      });
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          adjustCalloutImg();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', adjustCalloutImg);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', adjustCalloutImg);
    };
  }, []);

  // 强行移除 react-notion-x 表格表头第一行样式
  useEffect(() => {
    const targetCss = `${window.location.origin}/_next/static/css/`;

    for (let i = 0; i < document.styleSheets.length; i++) {
      const styleSheet = document.styleSheets[i];
      if (styleSheet?.href?.startsWith(targetCss)) {
        try {
          const rules = styleSheet.cssRules;
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j];
            if (rule.selectorText === '.notion-simple-table tr:first-child td') {
              styleSheet.deleteRule(j);
              break;
            }
          }
        } catch (error) {
          console.error('Error accessing stylesheet:', error, styleSheet.href);
        }
      }
    }

    return () => {};
  }, []);
};

export default useAdjustStyle;
