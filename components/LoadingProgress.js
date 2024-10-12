import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import NProgress from 'nprogress';

import { useGlobal } from '@/hooks/useGlobal';

/**
 * 页面加载进度条
 */
export default function LoadingProgress() {
  const router = useRouter();
  const [routing, setRouting] = useState(false);
  const { onLoading } = useGlobal();

  // 路由变化
  useEffect(() => {
    const handleStart = () => {
      setRouting(true);
    };

    const handleStop = () => {
      setRouting(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeError', handleStop);
    router.events.on('routeChangeComplete', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  useEffect(() => {
    if (routing || onLoading) {
      NProgress.start();
      document.body.style.overflow = 'hidden';
    } else {
      NProgress.done();
      document.body.style.overflow = '';
    }
  }, [onLoading, routing]);
}
