import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/notion/getNotionData'
import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async ctx => {
  const { allPages } = await getGlobalData({ from: 'rss' })
  const defaultFields = [
    {
      loc: `${siteConfig('LINK')}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${siteConfig('LINK')}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    },
    {
      loc: `${siteConfig('LINK')}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    },
    // {
    //   loc: `${siteConfig('LINK')}/feed`,
    //   lastmod: new Date().toISOString().split('T')[0],
    //   changefreq: 'daily',
    //   priority: '0.7'
    // },
    // {
    //   loc: `${siteConfig('LINK')}/search`,
    //   lastmod: new Date().toISOString().split('T')[0],
    //   changefreq: 'daily',
    //   priority: '0.7'
    // },
    {
      loc: `${siteConfig('LINK')}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.7'
    }
  ]
  const postFields = allPages
    ?.filter(p => p.status === BLOG.NOTION_PROPERTY_NAME.status_publish)
    ?.map(post => {
      const slugWithoutLeadingSlash = post?.slug.startsWith('/')
        ? post?.slug?.slice(1)
        : post.slug
      return {
        loc: `${siteConfig('LINK')}/${slugWithoutLeadingSlash}`,
        lastmod: new Date(post?.lastEditedDate).toISOString().split('T')[0],
        changefreq: 'daily',
        priority: post?.type === 'Menu' ? '0.9' : '0.8'
      }
    })
  const fields = defaultFields.concat(postFields)
  fields.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority))

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )

  return getServerSideSitemap(ctx, fields)
}

export default () => {}
