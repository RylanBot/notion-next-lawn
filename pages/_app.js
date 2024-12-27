import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';

import 'aos/dist/aos.css'; // You can also use <link> for styles
import 'react-notion-x/src/styles.css';

import '@/styles/animate.css'; // @see https://animate.style/
import '@/styles/globals.css';
import '@/styles/notion.css'; //  重写部分样式
import '@/styles/utility-patterns.css';

import ExternalPlugins from '@/components/ExternalPlugins';
import GlobalHead from '@/components/GlobalHead';
import LoadingProgress from '@/components/LoadingProgress';

import { THEME } from '@/blog.config';
import { GlobalContextProvider } from '@/hooks/useGlobal';
import { initLogging } from '@/lib/logger';
import { getQueryParam } from '@/lib/utils';
import { getGlobalLayoutByTheme } from '@/themes/theme';

const MyApp = ({ Component, pageProps }) => {
  const route = useRouter();
  const queryParam = useMemo(() => {
    return getQueryParam(route.asPath, 'theme') || THEME;
  }, [route]);

  const GLayout = useCallback(
    (props) => {
      // 根据页面路径加载不同Layout文件
      const Layout = getGlobalLayoutByTheme(queryParam);
      return <Layout {...props} />;
    },
    [queryParam]
  );

  useEffect(() => {
    initLogging();
  }, []);

  return (
    <GlobalContextProvider {...pageProps}>
      <LoadingProgress />
      <GLayout {...pageProps}>
        <GlobalHead {...pageProps} />
        <Component {...pageProps} />
      </GLayout>
      <ExternalPlugins {...pageProps} />
    </GlobalContextProvider>
  );
};

export default MyApp;
