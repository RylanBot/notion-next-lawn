import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isBrowser } from 'react-notion-x';

import BLOG from '@/blog.config';

/**
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 */
const pageview = (url) => {
  window.gtag('config', BLOG.ANALYTICS_GOOGLE_ID, {
    page_path: url
  });
};

const Gtag = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isBrowser) return;

    const gtagRouteChange = (url) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', gtagRouteChange);
    return () => {
      router.events.off('routeChangeComplete', gtagRouteChange);
    };
  }, [isBrowser, router.events]);

  return null;
};

export default Gtag;
