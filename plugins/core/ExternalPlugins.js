import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'react-notion-x';

import BLOG from '@/blog.config';
import { siteConfig } from '@/libs/common/config';
import { handleInternalUrls } from '@/libs/notion/page';

const VConsole = dynamic(() => import('@/plugins/debug/VConsole'), { ssr: false });
const AosAnimation = dynamic(() => import('@/plugins/animation/AOSAnimation'), { ssr: false });

const Analytics = dynamic(
  () =>
    import('@vercel/analytics/react').then(async (m) => {
      return m.Analytics;
    }),
  { ssr: false }
);
const Gtag = dynamic(() => import('@/plugins/analytics/Gtag'), { ssr: false });
const Busuanzi = dynamic(() => import('@/plugins/analytics/Busuanzi'), { ssr: false });
const LA51 = dynamic(() => import('@/plugins/analytics/LA51'), { ssr: false });

const Fireworks = dynamic(() => import('@/plugins/animation/Fireworks'), { ssr: false });
const RibbonFluttering = dynamic(() => import('@/plugins/animation/RibbonFluttering'), { ssr: false });
const Ribbon = dynamic(() => import('@/plugins/animation/Ribbon'), { ssr: false });
const MusicPlayer = dynamic(() => import('@/plugins/base/Player'), { ssr: false });

/**
 * 各种插件脚本
 */
const ExternalPlugin = (props) => {
  const router = useRouter();

  const POST_SUB_PATH = siteConfig('POST_SUB_PATH');
  const ANALYTICS_VERCEL = siteConfig('ANALYTICS_VERCEL');
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE');
  const ANALYTICS_CNZZ_ID = siteConfig('ANALYTICS_CNZZ_ID');
  const ANALYTICS_GOOGLE_ID = siteConfig('ANALYTICS_GOOGLE_ID');
  const ANALYTICS_51LA_ID = siteConfig('ANALYTICS_51LA_ID');
  const ANALYTICS_51LA_CK = siteConfig('ANALYTICS_51LA_CK');
  const CLARITY_ID = siteConfig('CLARITY_ID');
  const FIREWORKS = siteConfig('FIREWORKS');
  const RIBBON_FLUTTERING = siteConfig('RIBBON_FLUTTERING');
  const RIBBON = siteConfig('RIBBON');
  const MUSIC_PLAYER = siteConfig('MUSIC_PLAYER');

  useEffect(() => {
    if (!isBrowser) return;
    handleInternalUrls(props?.allNavPages, POST_SUB_PATH);
  }, [router, isBrowser]);

  return (
    <>
      {!BLOG.isProd && <VConsole />}

      <AosAnimation />

      {ANALYTICS_GOOGLE_ID && <Gtag />}
      {ANALYTICS_VERCEL && <Analytics />}
      {ANALYTICS_BUSUANZI_ENABLE && <Busuanzi />}

      {ANALYTICS_51LA_ID && ANALYTICS_51LA_CK && <LA51 />}
      {ANALYTICS_51LA_ID && ANALYTICS_51LA_CK && <script id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js" defer />}

      {CLARITY_ID && (
        <>
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
                `
            }}
          />
        </>
      )}

      {ANALYTICS_CNZZ_ID && (
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
          document.write(unescape("%3Cspan style='display:none' id='cnzz_stat_icon_${ANALYTICS_CNZZ_ID}'%3E%3C/span%3E%3Cscript src='https://s9.cnzz.com/z_stat.php%3Fid%3D${ANALYTICS_CNZZ_ID}' type='text/javascript'%3E%3C/script%3E"));
          `
          }}
        />
      )}

      {ANALYTICS_GOOGLE_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_GOOGLE_ID}`} />
          <script
            async
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
      {RIBBON_FLUTTERING && <RibbonFluttering />}
      {RIBBON && <Ribbon />}

      {MUSIC_PLAYER && <MusicPlayer />}
    </>
  );
};

export default ExternalPlugin;
