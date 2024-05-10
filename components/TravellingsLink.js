import { siteConfig } from '@/lib/config';
import { useEffect, useRef, useState } from 'react';
import LazyImage from './LazyImage';

/**
 * 友链接力
 */
const TravellingsLink = () => {
  const TRAVELLING_LINK = siteConfig('TRAVELLING_LINK');

  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  /* PC 端滑动关闭 */
  useEffect(() => {
    const scrollTrigger = () => {
      setShowModal(false);
    };

    window.addEventListener('scroll', scrollTrigger);
    return () => {
      window.removeEventListener('scroll', scrollTrigger);
    };
  }, []);

  /* 移动端触摸关闭 */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [modalRef]);

  if (!TRAVELLING_LINK) return;

  return (
    <>
      <button
        id='tranvellings'
        onClick={() => setShowModal(true)}
      >
        <i className="fa-solid fa-train-subway rainbow-text"></i>
      </button>

      {showModal && (
        <div className="w-full h-screen fixed inset-0 flex items-center justify-center z-10 px-4">
          <div className="w-full h-screen fixed inset-0 bg-black opacity-50"></div>
          <div ref={modalRef} className="w-96 bg-zinc-100 dark:bg-zinc-900 p-6 rounded z-20 border-4 border-teal-500 relative">
            <button onClick={() => setShowModal(false)}
              className="absolute top-0 right-2 m-2 text-zinc-800 hover:text-zinc-500 dark:text-zinc-200"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className='mb-4'>
              <a rel="noreferrer" target="_blank"
                href='https://www.travellings.cn/'
                className="text-lg font-bold mb-3 text-teal-600 dark:text-teal-300 hover:text-teal-500 dark:hover:text-teal-200"
              >
                <span className='text-base'>#</span> 友链接力计划
              </a>
              <p className="text-sm font-semibold pb-2 border-b-2 border-dashed text-teal-700 dark:text-teal-400 border-teal-700 dark:border-teal-500">
                点击按钮将随机跳转到一个在线博客网站
              </p>
            </div>
            <a rel="noreferrer" target="_blank"
              href='https://www.travellings.cn/go.html'
              className="float-right cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              <LazyImage src="https://www.travellings.cn/assets/logo.gif" className="w-28 h-7" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default TravellingsLink;
