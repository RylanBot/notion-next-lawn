import { useRouter } from 'next/router';
import { useEffect } from 'react';

import useGlobal from '@/hooks/useGlobal';
import busuanzi from '@/libs/subscribe/busuanzi';

let path = '';

const Busuanzi = () => {
  const { theme } = useGlobal();
  const router = useRouter();
  router.events.on('routeChangeComplete', (url, option) => {
    if (url !== path) {
      path = url;
      busuanzi.fetch();
    }
  });

  // 更换主题时更新
  useEffect(() => {
    if (theme) {
      busuanzi.fetch();
    }
  }, [theme]);
  return null;
};

export default Busuanzi;
