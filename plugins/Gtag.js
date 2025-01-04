import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isBrowser } from 'react-notion-x';

import * as gtag from '@/libs/subscribe/gtag';

const Gtag = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isBrowser) return;

    const gtagRouteChange = url => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', gtagRouteChange);
    return () => {
      router.events.off('routeChangeComplete', gtagRouteChange);
    };
  }, [isBrowser, router.events]);

  return null;
};

export default Gtag;
