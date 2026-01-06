import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import 'aos/dist/aos.css';
import 'react-notion-x/src/styles.css';

import '@/styles/animate.css';
import '@/styles/global.css';
import '@/styles/notion.css';

import { THEME } from '@/blog.config';
import { getQueryParam } from '@/libs/common/util';
import { getGlobalLayoutByTheme } from '@/themes';

import ExternalPlugins from '@/plugins/core/ExternalPlugins';
import GlobalHead from '@/plugins/core/GlobalHead';
import LoadingProgress from '@/plugins/animation/LoadingProgress';

import { GlobalContextProvider } from '@/hooks/useGlobal';

const MyApp = ({ Component, pageProps }) => {
  const route = useRouter();

  const queryParam = useMemo(() => {
    return getQueryParam(route.asPath, 'theme') || THEME;
  }, [route]);

  const GLayout = useCallback(
    (props) => {
      // 根据页面路径加载不同 Layout 文件
      const Layout = getGlobalLayoutByTheme(queryParam);
      return <Layout {...props} />;
    },
    [queryParam]
  );

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
