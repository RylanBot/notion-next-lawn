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
        {/* 遮罩 */}
        <div className="fixed inset-0 bg-black opacity-75" onClick={() => setShowModal(false)} />

        {/* 内容 */}
        <div
          ref={modalRef}
          className="relative w-[425px] p-6 bg-zinc-100 dark:bg-zinc-900 border-4 border-teal-500 max-sm:mb-10"
        >
          {/* 关闭按钮 */}
          <button
            className="absolute top-0 right-2 m-2 text-zinc-800 hover:text-zinc-500 dark:text-zinc-200"
            onClick={() => setShowModal(false)}
          >
            <i className="fa-solid fa-xmark" />
          </button>

          {/* 内容区 */}
          <div className="mb-4">
            <a
              className="text-lg font-bold mb-3 text-teal-600 dark:text-teal-300 hover:text-teal-500 dark:hover:text-teal-200 "
              rel="noreferrer"
              target="_blank"
              href="https://www.travellings.cn/"
            >
              <span className="text-base">#</span> {locale.TRVELLINGS.TITLE}
            </a>

            <p className="text-sm font-semibold pb-2 border-b-2 border-dashed text-teal-700 dark:text-teal-400 border-teal-700 dark:border-teal-500">
              {locale.TRVELLINGS.GUIDE}
            </p>
          </div>

          <a
            className="float-right cursor-pointer"
            rel="noreferrer"
            target="_blank"
            href="https://www.travellings.cn/go.html"
          >
            <img className="w-28 h-7" src={TRAVEL_IMAGE} />
          </a>
        </div>
      </div>
    </Portal>
  );
};

export const TravellingsButton = () => {
  const { setShowModal } = useTravellings();

  return (
    <button onClick={() => setShowModal(true)} className="text-gray-700 dark:text-gray-200">
      <i className="fa-solid fa-train-subway text-xl" />
    </button>
  );
};
