import { useEffect } from 'react';

import { useRouter } from 'next/router';

import NProgress from 'nprogress';

/**
 * 出现页面加载进度条
 */
export default function LoadingProgress() {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      NProgress.start();
      document.body.style.overflow = 'hidden';
    }

    const handleStop = () => {
      NProgress.done();
    }

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeError', handleStop);
    router.events.on('routeChangeComplete', handleStop);

    return () => {
      document.body.style.overflow = '';
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
      document.body.style.overflow = '';
    }
  }, [router])
}
