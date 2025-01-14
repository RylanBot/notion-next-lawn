import BLOG from '@/blog.config';
import { uploadDataToAlgolia } from '@/plugins/algolia/update';

import { getNotionPost } from '@/libs/notion';
import { getPostBlocks } from '@/libs/notion/block';
import { getGlobalData } from '@/libs/notion/site';
import { getPageTableOfContents } from '@/libs/notion/toc';

import Slug from '..';

/**
 * 解析三级以上目录 /article/parent_slug/notion_id
 */
const PrefixSlug = (props) => {
  return <Slug {...props} />;
};

export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    };
  }

  const from = 'slug-paths';
  const { allPages } = await getGlobalData({ from });
  return {
    paths: allPages
      ?.filter((row) => hasMultipleSlashes(row.slug) && row.type.indexOf('Menu') < 0)
      .map((row) => ({
        params: {
          prefix: row.slug.split('/')[0],
          slug: row.slug.split('/')[1],
          suffix: row.slug.split('/')[2]
        }
      })),
    fallback: true
  };
}

export async function getStaticProps({ params: { prefix, slug, suffix } }) {
  const fullSlug = `${prefix}/${slug}/${suffix}`;

  const from = `slug-props-${fullSlug}`;
  const props = await getGlobalData({ from });

  const firstSuffix = suffix[0];
  // 在数据库列表内查找文章
  props.post = props?.allPages?.find((p) => {
    return p.slug.toLowerCase() === `${slug}/${firstSuffix}`.toLowerCase();
  });

  // 处理非数据库文章的信息 -> 是否为子页面
  if (!props?.post && firstSuffix.length >= 32) {
    const post = await getNotionPost(firstSuffix);
    props.post = post;
  }

  // 无法获取文章
  if (!props?.post) {
    props.post = null;
    return { props, revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND) };
  }

  // 文章内容加载
  if (!props?.posts?.blockMap) {
    props.post.blockMap = await getPostBlocks(props.post.id, from);
    props.post.content = Object.keys(props.post.blockMap.block);
    props.post.toc = getPageTableOfContents(props.post, props.post.blockMap);
  }

  // 生成全文索引
  if (BLOG.ALGOLIA_APP_ID) {
    uploadDataToAlgolia(props?.post);
  }

  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

/**
 * 判断是否包含两个以上的 /
 */
function hasMultipleSlashes(str) {
  const regex = /\/+/g; // 创建正则表达式，匹配所有的斜杠符号
  const matches = str.match(regex); // 在字符串中找到所有匹配的斜杠符号
  return matches && matches.length >= 2; // 判断匹配的斜杠符号数量是否大于等于2
}

export default PrefixSlug;
