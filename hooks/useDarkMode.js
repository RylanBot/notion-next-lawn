import { useEffect, useState } from 'react';

const STORAGE_KEY = 'darkMode';
const CLASS_DARK = 'dark';
const CLASS_LIGHT = 'light';
const STYLE_ID = 'dark-mode-view-transition';

const injectViewTransition = () => {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;

  style.textContent = `
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root) { z-index: 1; }
::view-transition-new(root) { z-index: 2; }
`;

  document.head.appendChild(style);
};

const useDarkMode = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    injectViewTransition();

    const htmlElement = document.documentElement;

    const handleClassChange = () => {
      setDarkMode(htmlElement.classList.contains(CLASS_DARK));
    };

    handleClassChange();

    const observer = new MutationObserver(handleClassChange);
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleDarkMode = (event) => {
    const newDarkMode = !isDarkMode;

    const applyTheme = () => {
      const htmlElement = document.documentElement;
      htmlElement.classList.remove(newDarkMode ? CLASS_LIGHT : CLASS_DARK);
      htmlElement.classList.add(newDarkMode ? CLASS_DARK : CLASS_LIGHT);
      localStorage.setItem(STORAGE_KEY, newDarkMode.toString());
    };

    // 点击坐标
    const x = event?.clientX ?? 0;
    const y = event?.clientY ?? 0;
    const hasCoord = Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY);

    if (!hasCoord || !document.startViewTransition) {
      applyTheme();
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(applyTheme);

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        { clipPath },
        {
          duration: 400,
          easing: 'ease-in',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;
