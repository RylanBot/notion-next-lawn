import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';

import CONFIG from '../config';

/**
 * 文字版权信息
 */
export default function ArticleCopyright() {
  const router = useRouter();
  const { locale } = useGlobal();

  const [path, setPath] = useState(siteConfig('LINK') + router.asPath);

  useEffect(() => {
    setPath(window.location.href);
  }, []);

  if (!siteConfig('LAWN_ARTICLE_COPYRIGHT', null, CONFIG)) return <></>;

  return (
    <section className="mt-10 text-teal-900 dark:text-teal-100">
      <ul className="overflow-x-auto whitespace-nowrap rounded-2xl border border-teal-900/10 bg-stone-50 p-5 text-sm leading-8 dark:border-white/10 dark:bg-zinc-900">
        <li>
          <strong className="mr-2">{locale.COMMON.AUTHOR}:</strong>
          <Link className="hover:underline" href={'/about'}>
            {siteConfig('AUTHOR')}
          </Link>
        </li>
        <li>
          <strong className="mr-2">{locale.COMMON.URL}:</strong>
          <a className="whitespace-normal break-words hover:underline" href={path}>
            {path}
          </a>
        </li>
        <li>
          <strong className="mr-2">{locale.COMMON.COPYRIGHT}:</strong>
          {locale.COMMON.COPYRIGHT_NOTICE}
        </li>
      </ul>
    </section>
  );
}
