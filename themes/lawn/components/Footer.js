import { siteConfig } from '@/lib/config';

const Footer = () => {
  const since = siteConfig('SINCE');
  const BEI_AN = siteConfig('BEI_AN');
  // const TITLE = siteConfig('TITLE');
  // const VERSION = siteConfig('VERSION')

  const d = new Date();
  const currentYear = d.getFullYear();
  const copyrightDate = parseInt(since) < currentYear ? since + '-' + currentYear : currentYear;

  return (
    <footer className="relative z-10 dark:bg-black flex-shrink-0 bg-lawn-light-gray justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm p-6">
      {/* <DarkModeButton/> */}
      <i className="fas fa-copyright" /> {`${copyrightDate}`}
      <span>
        {/* <i className='mx-2 animate-pulse fas fa-heart' /> */}
        {/* <a
          href={siteConfig('LINK')}
          className='underline font-bold  dark:text-gray-300 '
        >
          {siteConfig('AUTHOR')}
        </a> */}
        <br />
        {BEI_AN && (
          <>
            <i className="fas fa-shield-alt" />
            <a href="https://beian.miit.gov.cn/" className="px-1">
              {BEI_AN}
            </a>
            <br />
          </>
        )}
        <span className="hidden busuanzi_container_site_pv mx-1">
          <i className="fas fa-eye" />
          <span className="px-1 busuanzi_value_site_pv"> </span>
        </span>
        <span className="hidden busuanzi_container_site_uv mx-1">
          <i className="fas fa-users" />
          <span className="px-1 busuanzi_value_site_uv"> </span>
        </span>
        {/* <h1 className='text-xs pt-4 text-light-400 dark:text-gray-400'>{title} {siteConfig('BIO') && <>|</>} {siteConfig('BIO')}</h1> */}
        {/* <p className='text-xs pt-2 text-light-500 dark:text-gray-500'>
          Powered by
          <a
            href='https://github.com/tangly1024/NotionNext'
            className='dark:text-gray-300 px-1'
          >
            NotionNext {VERSION}
          </a>
        </p> */}
      </span>
      <br />
    </footer>
  );
};

export default Footer;
