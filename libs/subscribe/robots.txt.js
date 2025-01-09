import fs from 'fs';
import { siteConfig } from '@/libs/common/config';

export async function generateRobotsTxt() {
  const content = `
    # *
    User-agent: *
    Allow: /
  
    # Sitemaps
    Sitemap: ${siteConfig('LINK')}/sitemap.xml
    `;
  try {
    fs.mkdirSync('./public', { recursive: true });
    fs.writeFileSync('./public/robots.txt', content);
  } catch (error) {
    // 在 vercel 运行环境是只读的，这里会报错；
    // 但在 vercel 编译阶段、或 VPS 等其他平台这行代码会成功执行
  }
}
