// eslint-disable-next-line @next/next/no-document-import-in-page
import BLOG from '@/blog.config';
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang={BLOG.LANG} translate='no'>
        <Head>
          <link rel='icon' href={`${BLOG.BLOG_FAVICON}`} />
          {/* 预加载字体 */}
          {BLOG.FONT_AWESOME && <>
            <link rel='prefetch' href={BLOG.FONT_AWESOME} as="style" crossOrigin="anonymous" />
            <link rel="stylesheet" href={BLOG.FONT_AWESOME} crossOrigin="anonymous" referrerPolicy="no-referrer" />
          </>}

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
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
