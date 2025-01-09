const fs = require('fs');
const path = require('path');
const BLOG = require('./blog.config');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: BLOG.BUNDLE_ANALYZER
});

/**
 * 扫描指定目录下的文件夹名，用于获取当前有几个主题
 */
function scanSubdirectories(directory) {
  const subdirectories = [];

  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      subdirectories.push(file);
    }
  });

  return subdirectories;
}
// 扫描项目 /themes 下的目录名
const themes = scanSubdirectories(path.resolve(__dirname, 'themes'));
module.exports = withBundleAnalyzer({
  reactStrictMode: !BLOG.isProd,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    // 图片压缩
    formats: ['image/avif', 'image/webp'],
    // 允许next/image加载的图片 域名
    domains: [
      'gravatar.com',
      'www.notion.so',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'p1.qhimg.com',
      'webmention.io'
    ]
  },
  // 默认将feed重定向至 /public/rss/feed.xml
  async redirects() {
    return [
      {
        source: '/feed',
        destination: '/rss/feed.xml',
        permanent: true
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path*.html',
        destination: '/:path*'
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
          }
        ]
      }
    ];
  },
  webpack: (config) => {
    // 动态主题：添加 resolve.alias 配置，将动态路径映射到实际路径
    // console.log('加载默认主题', path.resolve(__dirname, 'themes', BLOG.THEME))
    config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', BLOG.THEME);
    return config;
  },
  experimental: {
    scrollRestoration: true
  },
  exportPathMap: async function (defaultPathMap) {
    // 导出时 忽略/pages/sitemap.xml.js ， 否则报错getServerSideProps
    const pages = { ...defaultPathMap };
    delete pages['/sitemap.xml'];
    return pages;
  },
  publicRuntimeConfig: {
    // 这里的配置既可以服务端获取到，也可以在浏览器端获取到
    NODE_ENV_API: process.env.NODE_ENV_API || 'prod',
    THEMES: themes
  }
});
