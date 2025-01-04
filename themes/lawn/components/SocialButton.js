import { siteConfig } from '@/libs/common/config';

/**
 * 社交按钮
 */
const SocialButton = () => {
  const socialMedia = [
    { name: 'steam', icon: 'fab fa-steam', url: siteConfig('CONTACT_STEAM') },
    { name: 'github', icon: 'fab fa-github', url: siteConfig('CONTACT_GITHUB') },
    { name: 'bilibili', icon: 'fab fa-bilibili', url: siteConfig('CONTACT_BILIBILI') },
    { name: 'email', icon: 'fas fa-envelope', url: `mailto:${siteConfig('CONTACT_EMAIL')}` },
    { name: 'twitter', icon: 'fab fa-twitter', url: siteConfig('CONTACT_TWITTER') },
    { name: 'telegram', icon: 'fab fa-telegram', url: siteConfig('CONTACT_TELEGRAM') },
    { name: 'linkedin', icon: 'fab fa-linkedin', url: siteConfig('CONTACT_LINKEDIN') },
    { name: 'weibo', icon: 'fab fa-weibo', url: siteConfig('CONTACT_WEIBO') },
    { name: 'instagram', icon: 'fab fa-instagram', url: siteConfig('CONTACT_INSTAGRAM') },
    { name: 'rss', icon: 'fas fa-rss', url: JSON.parse(siteConfig('ENABLE_RSS')) ? '/feed' : null },
    { name: 'youtube', icon: 'fab fa-youtube', url: siteConfig('CONTACT_YOUTUBE') }
  ];

  return (
    <div className="w-full justify-center flex-wrap flex my-2">
      <div className="space-x-3 text-xl text-gray-600 dark:text-gray-300 ">
        {socialMedia.map(
          ({ name, icon, url }) =>
            url && (
              <a key={name} target="_blank" rel="noreferrer" title={name} href={url}>
                <i className={`${icon} transform duration-150 hover:scale-125 hover:text-teal-500 dark:hover:text-teal-300`} />
              </a>
            )
        )}
      </div>
    </div>
  );
};

export default SocialButton;