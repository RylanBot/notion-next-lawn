import fs from 'fs';

import BLOG from '@/blog.config';
import { siteConfig } from '@/libs/common/config';

export async function generateRobotsTxt() {
  if (!BLOG.isProd) return;

  const LINK = siteConfig('LINK');
  const content = `
    # *
    User-agent: *
    Allow: /
  
    # Sitemaps
    Sitemap: ${LINK}/sitemap.xml
    `;
  try {
    fs.mkdirSync('./public', { recursive: true });
    fs.writeFileSync('./public/robots.txt', content);
  } catch (error) {
    // 在 Vercel 运行环境是只读的，这里会报错
    // 但在 Vercel 编译阶段、或 VPS 等其他平台这行代码会成功执行
  }
}
