import Document, { Head, Html, Main, NextScript } from 'next/document';
import BLOG from '@/blog.config';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang={BLOG.LANG}>
        <Head>
          <link rel="icon" href={`${BLOG.BLOG_FAVICON}`} />
          {/* 初始化亮暗模式，避免闪烁 */}
          <script src="/js/dark.js"></script>
          {/* 预加载字体 */}
          {BLOG.FONT_AWESOME && (
            <>
              <link rel="prefetch" href={BLOG.FONT_AWESOME} as="style" crossOrigin="anonymous" />
              <link rel="stylesheet" href={BLOG.FONT_AWESOME} crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </>
          )}

          {BLOG.FONT_URL?.map((fontUrl, index) => {
            if (fontUrl.includes('css')) {
              return <link key={index} rel="stylesheet" href={fontUrl} />;
            } else {
              return <link key={index} rel="preload" href={fontUrl} as="font" type="font/woff2" />;
            }
          })}
        </Head>
        <body className="font-light scroll-smooth">
          <Main />
          <div id="__portals__"></div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
