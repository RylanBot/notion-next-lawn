import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import throttle from 'lodash.throttle';
import { uuidToId } from 'notion-utils';

import { useGlobal } from '@/hooks/useGlobal';

import Progress from './Progress';

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
        // GetBoundingClientRect returns values relative to viewport
        if (bbox.top - offset < 0) {
          currentId = section.getAttribute('data-id');
          prevBBox = bbox;
          continue;
        }
        // No need to continue loop, if last element has been detected
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
    <div className="px-3 py-1">
      <div className="w-full pb-2 font-bold text-lg text-black dark:text-white">{locale.COMMON.TABLE_OF_CONTENTS}</div>
      <div className="w-full pb-2">
        <Progress />
      </div>
      <div className="overflow-y-auto max-h-36 lg:max-h-96 overscroll-none scroll-hidden" ref={tocRef}>
        <nav className="h-full text-black">
          {toc.map((tocItem, index) => {
            return (
              <a
                key={tocIds[index]}
                href={`#${tocIds[index]}`}
                className={`notion-table-of-contents-item duration-300 transform font-light dark:text-gray-200 notion-table-of-contents-item-indent-level-${tocItem.indentLevel}`}
                title={tocItem.text}
              >
                <span
                  style={{ display: 'inline-block', marginLeft: tocItem.indentLevel * 16 }}
                  className={`truncate ${
                    activeId === tocIds[index] ? 'font-bold text-teal-600 dark:text-teal-400' : ''
                  }`}
                >
                  {tocItem.text}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Catalog;
