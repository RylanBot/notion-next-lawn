import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import LazyImage from '@/components/LazyImage';
import Tabs from '@/components/Tabs';

import { siteConfig } from '@/lib/config';
import { isBrowser, isSearchEngineBot } from '@/lib/utils';

const WalineComponent = dynamic(
  () => {
    return import('@/components/WalineComponent');
  },
  { ssr: false }
);

/**
 * 评论组件
 * @param {*} param0
 * @returns
 */
const Comment = ({ siteInfo, frontMatter, className }) => {
  const router = useRouter();
  const COMMENT_WALINE_SERVER_URL = siteConfig('COMMENT_WALINE_SERVER_URL');

  useEffect(() => {
    // 当连接中有特殊参数时跳转到评论区
    if (isBrowser && router.query.target === 'comment') {
      setTimeout(() => {
        const url = router.asPath.replace('?target=comment', '');
        history.replaceState({}, '', url);
        document?.getElementById('comment')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 10000);
    }

    if (!frontMatter) {
      document.body.style.overflow = 'hidden';
    }
  }, [frontMatter, router.query]);

  if (isSearchEngineBot()) {
    return;
  }

  if (!frontMatter) {
    return (
      <>
        {/* 全屏遮罩 */}
        <div className="fixed inset-0 bg-white z-10 dark:bg-zinc-950"></div>
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* 闪烁动画 */}
          <div
            className="relative border-8 border-slate-200 dark:border-slate-400 rounded-full"
            style={{ width: '50vmin', height: '50vmin' }}
          >
            <LazyImage
              src="/favicon.png"
              placeholderSrc="/favicon.png"
              className="animate-blink relative rounded-full w-full h-full bg-white"
            />
            {/* 小圆形固定在大圆形的右下角 */}
            {/* <div className="absolute bottom-0 right-0 h-10 w-10 mb-1 mr-1 md:h-12 md:w-12 md:mb-2 md:mr-2 lg:h-16 lg:w-16 lg:mb-4 lg:mr-4 bg-green-500 rounded-full border-4 border-slate-200"></div> */}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      id="comment"
      key={frontMatter?.id}
      className={`comment mt-5 text-gray-800 dark:text-gray-300 ${className && `${className}`}`}
    >
      <Tabs>
        {COMMENT_WALINE_SERVER_URL && (
          <div key="Waline">
            <WalineComponent />
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Comment;
