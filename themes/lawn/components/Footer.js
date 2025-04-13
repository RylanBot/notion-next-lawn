import { siteConfig } from '@/libs/common/config';

const Footer = () => {
  const AUTHOR = siteConfig('AUTHOR');
  const SINCE = siteConfig('SINCE');
  const BEI_AN = siteConfig('BEI_AN');
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE');

  const currentYear = new Date().getFullYear();
  const copyrightDate = parseInt(SINCE) < currentYear ? SINCE + ' - ' + currentYear : currentYear;

  return (
    <footer className="z-10 py-1 flex flex-col items-center justify-center w-full text-sm relative bg-teal-700 dark:bg-lawn-black-gray text-white">
      <div className="flex items-center justify-center my-1 space-x-6 font-times">
        <div className="flex items-center">
          <i className="fa-solid fa-robot mx-1" />
          <span className="text-base">{AUTHOR}</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-copyright mx-1" />
          <span>{copyrightDate}</span>
        </div>
        {/* 公共版权协议 */}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" rel="noopener" target="_blank">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/creativecommons-vocabulary/2020.11.3/assets/license_badges/small/by_nc_sa.svg" />
        </a>
      </div>
      {BEI_AN && (
        <div className="my-1">
          <i className="fas fa-shield-alt" />
          <a href="https://beian.miit.gov.cn/" className="px-1 my-2">
            {BEI_AN}
          </a>
          <br />
        </div>
      )}
      {ANALYTICS_BUSUANZI_ENABLE && (
        <div className="my-1">
          <span className="hidden busuanzi_container_site_pv mx-1">
            <i className="fas fa-eye" />
            <span className="px-1 busuanzi_value_site_pv"> </span>
          </span>
          <span className="hidden busuanzi_container_site_uv mx-1">
            <i className="fas fa-users" />
            <span className="px-1 busuanzi_value_site_uv"> </span>
          </span>
        </div>
      )}
    </footer>
  );
};

export default Footer;
