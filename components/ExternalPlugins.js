import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'react-notion-x';

import { siteConfig } from '@/lib/config';
import { handleInternalUrls } from '@/lib/notion/mapPageUrl';
import { loadExternalResource } from '@/lib/utils';

import { CUSTOM_EXTERNAL_CSS, CUSTOM_EXTERNAL_JS } from '@/blog.config';

import { GlobalStyle } from './GlobalStyle';
import LA51 from './LA51';

const VConsole = dynamic(() => import('@/components/VConsole'), { ssr: false });
const AosAnimation = dynamic(() => import('@/components/AOSAnimation'), { ssr: false });

const ThemeSwitch = dynamic(() => import('@/components/ThemeSwitch'), { ssr: false });
const CustomContextMenu = dynamic(() => import('@/components/CustomContextMenu'), { ssr: false });
const DebugPanel = dynamic(() => import('@/components/DebugPanel'), { ssr: false });

const Analytics = dynamic(() => import('@vercel/analytics/react').then(async (m) => { return m.Analytics; }), { ssr: false });
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false });
const Busuanzi = dynamic(() => import('@/components/Busuanzi'), { ssr: false });
const GoogleAdsense = dynamic(() => import('@/components/GoogleAdsense'), { ssr: false });

const Fireworks = dynamic(() => import('@/components/Fireworks'), { ssr: false });
const FlutteringRibbon = dynamic(() => import('@/components/FlutteringRibbon'), { ssr: false });
const Ribbon = dynamic(() => import('@/components/Ribbon'), { ssr: false });
const MusicPlayer = dynamic(() => import('@/components/Player'), { ssr: false });

/**
 * 各种插件脚本
 */
const ExternalPlugin = (props) => {
  const DISABLE_PLUGIN = siteConfig('DISABLE_PLUGIN');

  const THEME_SWITCH = siteConfig('THEME_SWITCH');
  const CUSTOM_RIGHT_CLICK_CONTEXT_MENU = siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU');;
  const DEBUG = siteConfig('DEBUG');

  const ANALYTICS_VERCEL = siteConfig('ANALYTICS_VERCEL');
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE');
  const ADSENSE_GOOGLE_ID = siteConfig('ADSENSE_GOOGLE_ID');
  const ANALYTICS_CNZZ_ID = siteConfig('ANALYTICS_CNZZ_ID');
  const ANALYTICS_GOOGLE_ID = siteConfig('ANALYTICS_GOOGLE_ID');
  const ANALYTICS_51LA_ID = siteConfig('ANALYTICS_51LA_ID');
  const ANALYTICS_51LA_CK = siteConfig('ANALYTICS_51LA_CK');
  const GLOBAL_JS = siteConfig('GLOBAL_JS');
  const CLARITY_ID = siteConfig('CLARITY_ID');

  const FIREWORKS = siteConfig('FIREWORKS');
  const FLUTTERINGRIBBON = siteConfig('FLUTTERINGRIBBON');
  const RIBBON = siteConfig('RIBBON');
  const MUSIC_PLAYER = siteConfig('MUSIC_PLAYER');

  const router = useRouter();

  // 自定义样式css和js引入
  if (isBrowser) {
    // 导入外部自定义脚本
    if (CUSTOM_EXTERNAL_JS && CUSTOM_EXTERNAL_JS.length > 0) {
      for (const url of CUSTOM_EXTERNAL_JS) {
        loadExternalResource(url, 'js');
      }
    }

    // 导入外部自定义样式
    if (CUSTOM_EXTERNAL_CSS && CUSTOM_EXTERNAL_CSS.length > 0) {
      for (const url of CUSTOM_EXTERNAL_CSS) {
        loadExternalResource(url, 'css');
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      handleInternalUrls(props?.allNavPages);
    }, 500);
  }, [router]);

  useEffect(() => {
    // 执行注入脚本
    // eslint-disable-next-line no-eval
    eval(GLOBAL_JS);
  }, []);

  if (DISABLE_PLUGIN) {
    return null;
  }

  return <>
    {/* 全局样式嵌入 */}
    <GlobalStyle />
    <VConsole />
    <AosAnimation />

    {THEME_SWITCH && <ThemeSwitch />}
    {CUSTOM_RIGHT_CLICK_CONTEXT_MENU && <CustomContextMenu {...props} />}
    {DEBUG && <DebugPanel />}

    {ANALYTICS_GOOGLE_ID && <Gtag />}
    {ANALYTICS_VERCEL && <Analytics />}
    {ANALYTICS_BUSUANZI_ENABLE && <Busuanzi />}
    {ADSENSE_GOOGLE_ID && <GoogleAdsense />}

    {ANALYTICS_51LA_ID && ANALYTICS_51LA_CK && <LA51 />}
    {ANALYTICS_51LA_ID && ANALYTICS_51LA_CK && <script id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js" defer />}

    {CLARITY_ID && (
      <>
        <script async dangerouslySetInnerHTML={{
          __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
                `
        }} />
      </>
    )}

    {ANALYTICS_CNZZ_ID && (
      <script async
        dangerouslySetInnerHTML={{
          __html: `
          document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_${ANALYTICS_CNZZ_ID}'%3E%3C/span%3E%3Cscript src='https://s9.cnzz.com/z_stat.php%3Fid%3D${ANALYTICS_CNZZ_ID}' type='text/javascript'%3E%3C/script%3E"));
          `
        }}
      />
    )}

    {ANALYTICS_GOOGLE_ID && (
      <>
        <script async
          src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_GOOGLE_ID}`}
        />
        <script async
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ANALYTICS_GOOGLE_ID}', {
                  page_path: window.location.pathname,
                });
              `
          }}
        />
      </>
    )}

    {/* 动画 */}
    {FIREWORKS && <Fireworks />}
    {FLUTTERINGRIBBON && <FlutteringRibbon />}
    {RIBBON && <Ribbon />}

    {MUSIC_PLAYER && <MusicPlayer />}
  </>;
};

export default ExternalPlugin;
