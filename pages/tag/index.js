import BLOG from '@/blog.config';
import { useGlobal } from '@/hooks/useGlobal';
import { siteConfig } from '@/libs/common/config';
import { getGlobalData } from '@/libs/notion/getNotionData';
import { getLayoutByTheme } from '@/themes/theme';
import { useRouter } from 'next/router';

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = props => {
  const { locale } = useGlobal()
  const { siteInfo } = props

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() })

  const meta = {
    title: `${locale.COMMON.TAGS} | ${siteConfig('TITLE')}`,
    description: siteConfig('DESCRIPTION'),
    image: siteInfo?.pageCover,
    slug: 'tag',
    type: 'website'
  }
  props = { ...props, meta }

  return <Layout {...props} />
}

export async function getStaticProps() {
  const from = 'tag-index-props'
  const props = await getGlobalData({ from })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default TagIndex
