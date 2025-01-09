import { useRouter } from 'next/router';

import { getLayoutByTheme } from '@/themes';

import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/site';

/**
 * 404
 */
const NoFound = (props) => {
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() });
  return <Layout {...props} />;
};

export async function getStaticProps() {
  const props = (await getGlobalData({ from: '404' })) || {};
  return { props };
}

export default NoFound;
