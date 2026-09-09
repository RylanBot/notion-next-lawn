import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import throttle from 'lodash.throttle';
import { uuidToId } from 'notion-utils';

import useGlobal from '@/hooks/useGlobal';

/**
 * 目录导航组件
 */
const Catalog = ({ toc }) => {
  const { locale } = useGlobal();

  const tocRef = useRef(null);
  const tocIds = useMemo(() => toc.map((item) => uuidToId(item.id)), [toc]);

  const [activeId, setActiveId] = useState(null);

  const handleSectionScroll = useCallback(
    throttle(() => {
      const sections = document.getElementsByClassName('notion-h');
      let prevBBox = null;
      let currentId = activeId;
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i];
        if (!section || !(section instanceof Element)) continue;
        if (!currentId) {
          currentId = section.getAttribute('data-id');
        }
        const bbox = section.getBoundingClientRect();
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0;
        const offset = Math.max(150, prevHeight / 4);
        if (bbox.top - offset < 0) {
          currentId = section.getAttribute('data-id');
          prevBBox = bbox;
          continue;
        }
        break;
      }
      setActiveId(currentId);
      const index = tocIds.indexOf(currentId) || 0;
      tocRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' });
    }, 200)
  );

  useEffect(() => {
    window.addEventListener('scroll', handleSectionScroll);
    handleSectionScroll();
    return () => {
      window.removeEventListener('scroll', handleSectionScroll);
    };
  }, []);

  if (!toc) return <></>;

  return (
    <div className="flex w-56 flex-col gap-4 rounded-lg border border-teal-900 bg-stone-50 p-6 shadow-md dark:border-white/40 dark:bg-zinc-900">
      <div className="text-lg font-bold leading-6 text-zinc-900 dark:text-white">{locale.COMMON.TABLE_OF_CONTENTS}</div>
      <div className="h-px w-full bg-teal-900 opacity-30 dark:bg-white" />
      <div className="max-h-[70vh] overflow-y-auto overscroll-none scroll-hidden" ref={tocRef}>
        <nav className="flex flex-col gap-3">
          {toc.map((tocItem, index) => {
            const active = activeId === tocIds[index];
            const isTopLevel = tocItem.indentLevel === 0;
            return (
              <a
                key={tocIds[index]}
                href={`#${tocIds[index]}`}
                title={tocItem.text}
                className={clsx(
                  'block truncate text-sm leading-5 transition-colors',
                  isTopLevel ? 'font-bold' : tocItem.indentLevel > 1 ? 'pl-4' : 'pl-3',
                  active
                    ? 'text-teal-700 dark:text-teal-400'
                    : isTopLevel
                      ? 'text-teal-900 hover:text-teal-700 dark:text-white dark:hover:text-teal-400'
                      : 'text-stone-500 hover:text-teal-700 dark:text-zinc-400 dark:hover:text-teal-400'
                )}
              >
                {tocItem.text}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Catalog;
