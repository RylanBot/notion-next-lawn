import { useRouter } from 'next/router';
import useGlobal from '@/hooks/useGlobal';

export default function FloatLangSwitchButton() {
  const router = useRouter();
  const { pathname, query } = router;

  const { isChinese, changeLang } = useGlobal();

  function handleSwitchLang() {
    const newLang = isChinese ? 'en' : 'zh';
    changeLang(newLang);
    router.push({
      pathname,
      query: {
        ...query,
        lang: newLang
      }
    });
  }

  return (
    <div className="group right-float-tooltip-parent">
      <i className="fa-solid fa-language text-xs" onClick={handleSwitchLang}></i>
      <span className="right-float-tooltip -left-4">{isChinese ? 'English' : '中文'}</span>
    </div>
  );
}
