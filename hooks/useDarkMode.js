import { useEffect, useState } from 'react';

const STORAGE_KEY = 'darkMode';
const CLASS_DARK = 'dark';
const CLASS_LIGHT = 'light';
const STYLE_ID = 'dark-mode-view-transition';

let isSwitching = false;

const injectViewTransition = () => {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

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

const applyTheme = (goingDark) => {
  const html = document.documentElement;
  html.classList.remove(goingDark ? CLASS_LIGHT : CLASS_DARK);
  html.classList.add(goingDark ? CLASS_DARK : CLASS_LIGHT);
  localStorage.setItem(STORAGE_KEY, String(goingDark));
};

const resolveOrigin = (event) => {
  if (Number.isFinite(event?.clientX) && Number.isFinite(event?.clientY)) {
    return { x: event.clientX, y: event.clientY };
  }

  const rect = event?.currentTarget?.getBoundingClientRect?.();
  if (rect?.width) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  return null;
};

const useDarkMode = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    injectViewTransition();

    const html = document.documentElement;
    const sync = () => setDarkMode(html.classList.contains(CLASS_DARK));
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = (event) => {
    if (isSwitching) return;

    injectViewTransition();

    const goingDark = !document.documentElement.classList.contains(CLASS_DARK);
    const origin = resolveOrigin(event);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!origin || typeof document.startViewTransition !== 'function' || reducedMotion) {
      applyTheme(goingDark);
      return;
    }

    const { x, y } = origin;
    const xPct = `${(x / window.innerWidth) * 100}%`;
    const yPct = `${(y / window.innerHeight) * 100}%`;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    isSwitching = true;

    try {
      const transition = document.startViewTransition(() => applyTheme(goingDark));

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [`circle(0px at ${xPct} ${yPct})`, `circle(${endRadius}px at ${xPct} ${yPct})`]
            },
            {
              duration: 400,
              easing: 'ease-in',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        })
        .catch(() => {});

      transition.finished.finally(() => {
        isSwitching = false;
        document.documentElement.style.removeProperty('clip-path');
      });
    } catch {
      isSwitching = false;
      document.documentElement.style.removeProperty('clip-path');
      applyTheme(goingDark);
    }
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;
