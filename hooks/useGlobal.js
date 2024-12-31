import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { isBrowser } from 'react-notion-x';

import { THEMES } from '@/themes/theme';

import { generateLocaleDict } from '@/lib/lang';
import { getQueryVariable } from '@/lib/utils';

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
      theme,
      setTheme,
      switchTheme,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);
