import { siteConfig } from '@/lib/config';

const Footer = () => {
  const since = siteConfig('SINCE');
  const BEI_AN = siteConfig('BEI_AN');
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE');

  const d = new Date();
  const currentYear = d.getFullYear();
  const copyrightDate = parseInt(since) < currentYear ? since + '-' + currentYear : currentYear;

  return (
    <footer className="z-10 pt-4 pb-2 flex flex-col items-center justify-center w-full text-sm relative dark:bg-black bg-lawn-light-gray text-gray-600 dark:text-gray-100">
      <div className="mb-2" >
        <i className="fas fa-copyright" />
        <span> {`${copyrightDate}`}</span>
      </div>
      {BEI_AN && (
        <div className="mb-2">
          <i className="fas fa-shield-alt" />
          <a href="https://beian.miit.gov.cn/" className="px-1 my-2">
            {BEI_AN}
          </a>
          <br />
        </div>
      )}
      {ANALYTICS_BUSUANZI_ENABLE && (
        <div className='mb-2'>
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
    </footer >
  );
};

export default Footer;
