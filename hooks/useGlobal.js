import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

import { THEMES } from '@/themes/theme';

import { getQueryVariable, isBrowser } from '@/lib/utils';
import { generateLocaleDict } from '@/lib/lang';

import { LANG, THEME } from 'blog.config';

const GlobalContext = createContext();

/**
 * 全局变量，包括语言、主题、深色模式、加载状态等
 */
export function GlobalContextProvider(props) {
  const { post, children, siteInfo, categoryOptions, tagOptions, NOTION_CONFIG } = props;
  const fullWidth = post?.fullWidth ?? false;

  const router = useRouter();

  const [theme, setTheme] = useState(NOTION_CONFIG?.THEME || THEME);
  const [lang, setLang] = useState(NOTION_CONFIG?.LANG || LANG);
  const [locale, setLocale] = useState(generateLocaleDict(NOTION_CONFIG?.LANG || LANG));
  const [isDarkMode, setDarkMode] = useState("light");

  const [onLoading, setOnLoading] = useState(false);

  const switchTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const newIndex = currentIndex < THEMES.length - 1 ? currentIndex + 1 : 0;
    const newTheme = THEMES[newIndex];
    const query = router.query;
    query.theme = newTheme;
    router.push({ pathname: router.pathname, query });
    return newTheme;
  };

  const changeLang = (lang) => {
    setLang(lang);
    setLocale(generateLocaleDict(lang));
  };

  const toggleDarkMode = () => {
    const isNewDark = !isDarkMode;
    setDarkMode(isNewDark);
    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.classList.remove(isNewDark ? 'light' : 'dark');
    htmlElement.classList.add(isNewDark ? 'dark' : 'light');
    window.localStorage.setItem('darkMode', isNewDark);
  };

  useEffect(() => {
    if (!isBrowser) return;

    const initLocale = () => {
      const localLang = getQueryVariable('lang') || window.navigator.language;
      changeLang(localLang);
    };

    const initDarkMode = () => {
      const isLocalDark = window.localStorage.getItem('darkMode');
      setDarkMode(isLocalDark === 'true');
    };

    initLocale();
    initDarkMode();
  }, [isBrowser]);

  return (
    <GlobalContext.Provider value={{
      siteInfo,
      categoryOptions,
      tagOptions,
      NOTION_CONFIG,
      fullWidth,
      onLoading,
      setOnLoading,
      lang,
      locale,
      changeLang,
      isDarkMode,
      toggleDarkMode,
      theme,
      setTheme,
      switchTheme,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);
