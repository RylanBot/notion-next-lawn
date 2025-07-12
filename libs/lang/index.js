import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';

import { getQueryVariable, mergeDeep } from '../common/util';

/**
 * 国家-地区
 */
const LOCALES = {
  'en-US': enUS,
  'zh-CN': zhCN
};

/**
 * 获取当前语言的字典
 */
export function generateLocaleDict(langString) {
  const supportedLocales = Object.keys(LOCALES);
  let userLocale;

  // 将语言字符串拆分为语言和地区代码，例如将 "zh-CN" 拆分为 "zh" 和 "CN"
  const [language, region] = langString?.split(/[-_]/);

  // 优先匹配语言和地区都匹配的情况
  const specificLocale = `${language}-${region}`;
  if (supportedLocales.includes(specificLocale)) {
    userLocale = LOCALES[specificLocale];
  }

  // 然后尝试匹配只有语言匹配的情况
  if (!userLocale) {
    const languageOnlyLocales = supportedLocales.filter((locale) => locale.startsWith(language));
    if (languageOnlyLocales.length > 0) {
      userLocale = LOCALES[languageOnlyLocales[0]];
    }
  }

  // 如果还没匹配到，则返回最接近的语言包
  if (!userLocale) {
    const fallbackLocale = supportedLocales.find((locale) => locale.startsWith('en'));
    userLocale = LOCALES[fallbackLocale];
  }

  return mergeDeep({}, LOCALES['en-US'], userLocale);
}

export function getPreferredLang() {
  return getQueryVariable('lang') || getQueryVariable('locale') || window.navigator.language;
}
