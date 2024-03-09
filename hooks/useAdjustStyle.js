import { useEffect } from 'react';
import { useGlobal } from '@/lib/global'

const useAdjustStyle = () => {
    const { isDarkMode } = useGlobal()

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

        adjustCalloutImg();

        window.addEventListener('resize', adjustCalloutImg);
        return () => {
            window.removeEventListener('resize', adjustCalloutImg);
        };
    }, []);

    // 自定义 iframe 组件适配黑夜模式
    useEffect(() => {
        const color = isDarkMode ? "#000000" : "#f5f5f5";
        const subdomain = "notion-widgets";
    
        const changeWidgetsColor = () => {
            const iframes = document.querySelectorAll('.notion-asset-wrapper iframe');
            iframes.forEach(iframe => {
                const hostname = new URL(iframe.src).hostname;
                if (hostname.includes(subdomain)) {
                    iframe.contentWindow.postMessage(color, '*');
                }
            });
        };
    
        changeWidgetsColor();

        window.addEventListener('load', changeWidgetsColor);
        return () => {
            window.removeEventListener('load', changeWidgetsColor);
        };
    }, [isDarkMode]);
    
};

export default useAdjustStyle;
