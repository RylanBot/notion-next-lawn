import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isBrowser } from 'react-notion-x';

import Tabs from '@/plugins/base/Tabs';
import { useGlobal } from '@/hooks/useGlobal';

import { siteConfig } from '@/libs/common/config';
import { isSearchEngineBot } from '@/libs/common/util';

const WalineComment = dynamic(
  () => {
    return import('@/plugins/comment/WalineComment');
  },
  { ssr: false }
);

/**
 * 评论组件
 */
const Comment = ({ post }) => {
  const router = useRouter();
  const { setOnLoading } = useGlobal();

  const COMMENT_WALINE_SERVER_URL = siteConfig('COMMENT_WALINE_SERVER_URL');

  // 当连接中有特殊参数时跳转到评论区
  useEffect(() => {
    if (isBrowser && router.query.target === 'comment') {
      setTimeout(() => {
        const url = router.asPath.replace('?target=comment', '');
        history.replaceState({}, '', url);
        document.getElementById('comment')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 10000);
    }
  }, [router.query]);

  useEffect(() => {
    setOnLoading(!post);
  }, [post]);

  if (isSearchEngineBot() || !post) return;

  return (
    <div id="comment" key={post?.id} className="mt-5 text-gray-800 dark:text-gray-300 overflow-hidden">
      <Tabs>
        {COMMENT_WALINE_SERVER_URL && (
          <div key="Waline">
            <WalineComment />
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Comment;
