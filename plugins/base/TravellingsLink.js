import { createContext, useContext, useEffect, useRef, useState } from 'react';

import useGlobal from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import Portal from './Portal';

const TRAVEL_IMAGE = 'https://www.travellings.cn/assets/logo.gif';

const TravellingsContext = createContext(null);

export const TravellingsProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  return <TravellingsContext.Provider value={{ showModal, setShowModal }}>{children}</TravellingsContext.Provider>;
};

const useTravellings = () => {
  const context = useContext(TravellingsContext);
  if (!context) {
    throw new Error('useTravellings must be used within TravellingsProvider');
  }
  return context;
};

export const TravellingsModal = () => {
  const FONT_STYLE = siteConfig('FONT_STYLE');

  const { locale } = useGlobal();
  const { showModal, setShowModal } = useTravellings();

  const modalRef = useRef(null);

  /* PC 端滚动关闭 */
  useEffect(() => {
    if (!showModal) return;

    const handleScroll = () => setShowModal(false);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showModal, setShowModal]);

  /* 移动端触摸关闭 */
  useEffect(() => {
    if (!showModal) return;

    const handleClickOutside = (event) => {
      if (!modalRef.current?.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal, setShowModal]);

  return (
    <Portal container={() => document.getElementById('__portals__')}>
      <div
        id="travellings"
        className={`${FONT_STYLE} fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity ${
          showModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="fixed inset-0 bg-zinc-950/50" onClick={() => setShowModal(false)} />

        <div
          ref={modalRef}
          className="relative w-full max-w-md rounded-md border-2 border-teal-600 bg-stone-50 p-8 shadow-lg max-sm:mb-10 dark:border-teal-700 dark:bg-zinc-900"
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-teal-900 transition-colors hover:bg-teal-700/10 hover:text-teal-700 dark:text-white dark:hover:bg-white/10 dark:hover:text-teal-500"
            onClick={() => setShowModal(false)}
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <div className="pr-8">
            <a
              className="text-xl text-zinc-900 transition-colors hover:text-teal-700 dark:text-white dark:hover:text-teal-500"
              rel="noreferrer"
              target="_blank"
              href="https://www.travellings.cn/"
            >
              {locale.TRVELLINGS.TITLE}
            </a>

            <p className="mt-3 border-b border-dashed border-teal-900/25 pb-4 text-sm leading-relaxed text-stone-500 dark:border-white/20 dark:text-zinc-400">
              {locale.TRVELLINGS.GUIDE}
            </p>
          </div>

          <a
            className="mt-6 ml-auto flex w-fit items-center gap-2 text-sm text-teal-800 transition-colors hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
            rel="noreferrer"
            target="_blank"
            href="https://www.travellings.cn/go.html"
          >
            <img className="h-7 w-28" src={TRAVEL_IMAGE} alt="" />
          </a>
        </div>
      </div>
    </Portal>
  );
};

export const TravellingsButton = () => {
  const { setShowModal } = useTravellings();

  return (
    <button
      type="button"
      onClick={() => setShowModal(true)}
      className="flex h-8 w-8 items-center justify-center rounded-full text-teal-900 transition-colors hover:bg-teal-700/10 hover:text-teal-700 dark:text-white dark:hover:bg-white/10 dark:hover:text-teal-500"
    >
      <i className="fa-solid fa-train-subway text-sm" />
    </button>
  );
};
