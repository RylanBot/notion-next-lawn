import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Tabs from '@/components/Tabs';
import { Loading } from '@/components/LoadingProgress';

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
 */
const Comment = ({ frontMatter, className }) => {
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
  }, [router.query]);

  if (isSearchEngineBot()) {
    return;
  }

  // 如果直接通过 setOnLoading 会有白屏闪烁
  if (!frontMatter) return <Loading />;

  return (
    <div
      id="comment"
      key={frontMatter?.id}
      className={`comment mt-5 text-gray-800 dark:text-gray-300 overflow-hidden ${`${className || ''}`}`}
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
