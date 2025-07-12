import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { isBrowser } from 'react-notion-x';

import { LANG, THEME } from '@/blog.config';
import { THEMES } from '@/themes';

import { generateLocaleDict, getPreferredLang } from '@/libs/lang';

const GlobalContext = createContext();

/**
 * 全局变量
 */
export const GlobalContextProvider = (props) => {
  const { NOTION_CONFIG, post, children, siteInfo, categoryOptions, tagOptions } = props;
  const fullWidth = post?.fullWidth ?? false;

  const router = useRouter();

  const [theme, setTheme] = useState(NOTION_CONFIG?.THEME || THEME);
  const [lang, setLang] = useState(LANG);
  const [locale, setLocale] = useState(generateLocaleDict(lang));
  const [onLoading, setOnLoading] = useState(false);

  const isChinese = lang.startsWith('zh');

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
    const preferredLang = getPreferredLang();
    changeLang(preferredLang);
  }, [isBrowser]);

  useEffect(() => {
    const newLang = router.query.lang || router.query.locale;
    if (newLang) {
      changeLang(newLang);
    }
  }, [router.asPath]);

  return (
    <GlobalContext.Provider
      value={{
        NOTION_CONFIG,
        siteInfo,
        categoryOptions,
        tagOptions,
        fullWidth,
        onLoading,
        setOnLoading,
        lang,
        locale,
        isChinese,
        changeLang,
        theme,
        setTheme,
        switchTheme
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobal = () => useContext(GlobalContext);
export default useGlobal;
