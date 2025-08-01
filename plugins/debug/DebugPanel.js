import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import useGlobal from '@/hooks/useGlobal';
import { THEMES } from '@/themes';

import { siteConfigMap } from '@/libs/common/config';
import { getQueryParam } from '@/libs/common/util';

import Select from '../base/Select';

const DebugPanel = () => {
  const router = useRouter();
  const currentTheme = getQueryParam(router.asPath, 'theme') || theme;

  const { theme, switchTheme, locale } = useGlobal();

  const [show, setShow] = useState(false);
  const [siteConfig, updateSiteConfig] = useState({});

  // 主题下拉框
  const themeOptions = THEMES?.map((t) => ({ value: t, text: t }));

  useEffect(() => {
    updateSiteConfig(Object.assign({}, siteConfigMap()));
  }, []);

  function toggleShow() {
    setShow(!show);
  }

  function handleChangeDebugTheme() {
    switchTheme();
  }

  function handleUpdateDebugTheme(newTheme) {
    const query = { ...router.query, theme: newTheme };
    router.push({ pathname: router.pathname, query });
  }

  function filterResult(text) {
    switch (text) {
      case 'true':
        return <span className="text-green-500">true</span>;
      case 'false':
        return <span className="text-red-500">false</span>;
      case '':
        return '-';
    }
    return text;
  }

  return (
    <>
      {/* 调试按钮 */}
      <div>
        <div
          className={`bg-black text-xs text-white shadow-2xl p-1.5 rounded-l-xl cursor-pointer ${
            show ? 'right-96' : 'right-0'
          } fixed bottom-72 duration-200 z-50`}
          style={{ writingMode: 'vertical-lr' }}
          onClick={toggleShow}
        >
          {show ? (
            <i className="fas fa-times">&nbsp;{locale.COMMON.DEBUG_CLOSE}</i>
          ) : (
            <i className="fas fa-tools">&nbsp;{locale.COMMON.DEBUG_OPEN}</i>
          )}
        </div>
      </div>

      {/* 调试侧拉抽屉 */}
      <div
        className={` ${
          show ? 'w-96 right-0 ' : '-right-96 invisible w-0'
        } overflow-y-scroll h-full p-5 bg-white fixed bottom-0 z-50 duration-200`}
      >
        <div className="flex justify-between space-x-1 my-5">
          <div className="flex">
            <Select
              label={locale.COMMON.THEME_SWITCH}
              value={currentTheme}
              options={themeOptions}
              onChange={handleUpdateDebugTheme}
            />
            <div className="p-2 cursor-pointer" onClick={handleChangeDebugTheme}>
              <i className="fas fa-sync" />
            </div>
          </div>

          <div className="p-2">
            <i className="fas fa-times" onClick={toggleShow} />
          </div>
        </div>

        <div>
          <div className="font-bold w-18 border-b my-2">站点配置[blog.config.js]</div>
          <div className="text-xs">
            {siteConfig &&
              Object.keys(siteConfig).map((k) => (
                <div key={k} className="justify-between flex py-1">
                  <span className="bg-blue-500 p-0.5 rounded text-white mr-2">{k}</span>
                  <span className="whitespace-nowrap">{filterResult(siteConfig[k] + '')}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default DebugPanel;
