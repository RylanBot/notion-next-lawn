import useGlobal from '@/hooks/useGlobal';
import { useEffect, useRef, useState } from 'react';

const TRAVEL_IMAGE = 'https://www.travellings.cn/assets/logo.gif';
/**
 * 友链接力
 */
const TravellingsLink = () => {
  const { locale } = useGlobal();

  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  /* PC 端滑动关闭 */
  useEffect(() => {
    const handleScroll = () => {
      setShowModal(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        <i className="fa-solid fa-train-subway rainbow-text"></i>
      </button>

      {showModal && (
        <div className="w-full h-screen fixed inset-0 flex items-center justify-center px-4 z-50">
          <div className="w-full h-screen fixed inset-0 bg-black opacity-75"></div>
          <div
            ref={modalRef}
            className="w-[425px] bg-zinc-100 dark:bg-zinc-900 p-6 rounded border-4 border-teal-500 relative max-sm:mb-10"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-0 right-2 m-2 text-zinc-800 hover:text-zinc-500 dark:text-zinc-200"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="mb-4">
              <a
                rel="noreferrer"
                target="_blank"
                href="https://www.travellings.cn/"
                className="text-lg font-bold mb-3 text-teal-600 dark:text-teal-300 hover:text-teal-500 dark:hover:text-teal-200"
              >
                <span className="text-base">#</span> {locale.TRVELLINGS.TITLE}
              </a>
              <p className="text-sm font-semibold pb-2 border-b-2 border-dashed text-teal-700 dark:text-teal-400 border-teal-700 dark:border-teal-500">
                {locale.TRVELLINGS.GUIDE}
              </p>
            </div>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.travellings.cn/go.html"
              className="float-right cursor-pointer"
            >
              <img className="w-28 h-7" src={TRAVEL_IMAGE} />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default TravellingsLink;
