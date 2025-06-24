import { useEffect, useState } from 'react';

const storageKey = 'darkMode';
const classDark = 'dark';
const classLight = 'light';

const useDarkMode = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;

    const handleClassChange = () => {
      setDarkMode(htmlElement.classList.contains('dark'));
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

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;

    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.classList.remove(newDarkMode ? classLight : classDark);
    htmlElement.classList.add(newDarkMode ? classDark : classLight);

    window.localStorage.setItem(storageKey, newDarkMode.toString());
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;
