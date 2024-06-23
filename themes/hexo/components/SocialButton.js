import { siteConfig } from '@/lib/config'

/**
 * 社交按钮
 */
const SocialButton = () => {
  return (
    <div className='w-full justify-center flex-wrap flex my-2'>
      <div className='space-x-3 text-xl text-gray-600 dark:text-gray-300 '>
      {siteConfig('CONTACT_STEAM') && <a target='_blank' rel='noreferrer' title={'steam'} href={siteConfig('CONTACT_STEAM')} >
          <i className='social-icon fab fa-brands fa-steam' />
        </a>}
        {siteConfig('CONTACT_GITHUB') && <a target='_blank' rel='noreferrer' title={'github'} href={siteConfig('CONTACT_GITHUB')} >
          <i className='social-icon fab fa-github' />
        </a>}
        {siteConfig('CONTACT_BILIBILI') && <a target='_blank' rel='noreferrer' title={'bilibili'} href={siteConfig('CONTACT_BILIBILI')} >
          <i className='social-icon fab fa-bilibili' />
        </a>}
        {siteConfig('CONTACT_EMAIL') && <a target='_blank' rel='noreferrer' title={'email'} href={`mailto:${siteConfig('CONTACT_EMAIL')}`} >
          <i className='social-icon fas fa-envelope' />
        </a>}
        {siteConfig('CONTACT_TWITTER') && <a target='_blank' rel='noreferrer' title={'twitter'} href={siteConfig('CONTACT_TWITTER')} >
          <i className='social-icon fab fa-twitter' />
        </a>}
        {siteConfig('CONTACT_TELEGRAM') && <a target='_blank' rel='noreferrer' href={siteConfig('CONTACT_TELEGRAM')} title={'telegram'} >
          <i className='social-icon fab fa-telegram' />
        </a>}
        {siteConfig('CONTACT_LINKEDIN') && <a target='_blank' rel='noreferrer' href={siteConfig('CONTACT_LINKEDIN')} title={'linkIn'} >
          <i className='social-icon fab fa-linkedin' />
        </a>}
        {siteConfig('CONTACT_WEIBO') && <a target='_blank' rel='noreferrer' title={'weibo'} href={siteConfig('CONTACT_WEIBO')} >
          <i className='social-icon fab fa-weibo' />
        </a>}
        {siteConfig('CONTACT_INSTAGRAM') && <a target='_blank' rel='noreferrer' title={'instagram'} href={siteConfig('CONTACT_INSTAGRAM')} >
          <i className='social-icon fab fa-instagram' />
        </a>}
        {JSON.parse(siteConfig('ENABLE_RSS')) && <a target='_blank' rel='noreferrer' title={'RSS'} href={'/feed'} >
          <i className='social-icon fas fa-rss' />
        </a>}
        {siteConfig('CONTACT_YOUTUBE') && <a target='_blank' rel='noreferrer' title={'youtube'} href={siteConfig('CONTACT_YOUTUBE')} >
          <i className='social-icon fab fa-youtube' />
        </a>}
      </div>
  </div>
)}

export default SocialButton
