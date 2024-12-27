import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isBrowser } from 'react-notion-x';

import { useGlobal } from '@/hooks/useGlobal';

export const Loading = () => {
  return (
    <>
      <div className="h-screen w-screen fixed inset-0 bg-white dark:bg-zinc-950 flex justify-center items-center z-50 m-auto">
        <div className="relative border-8 border-slate-200 dark:border-slate-400 rounded-full p-2 h-72 w-72 max-sm:h-44 max-sm:w-44 max-sm:mb-10"
        >
          <img src="/favicon.png" className="animate-blink relative rounded-full w-full h-full" />
        </div>
      </div>
    </>
  );
};

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
      setTimeout(() => {
        setRouting(false);
      }, 1500);
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
    if (!isBrowser) return;

    if (routing || onLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isBrowser, routing, onLoading]);

  if (routing || onLoading) return <Loading />;
}
