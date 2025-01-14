import BLOG from '@/blog.config';
import { uploadDataToAlgolia } from '@/plugins/algolia/update';

import { getNotionPost } from '@/libs/notion';
import { getPostBlocks } from '@/libs/notion/block';
import { getGlobalData } from '@/libs/notion/site';
import { getPageTableOfContents } from '@/libs/notion/toc';

import Slug from '..';

/**
 * 解析二级目录 /article/cs123
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
  const paths = allPages
    ?.filter((row) => row.status === 'Published' && row.type === 'Post')
    .map((row) => ({
      params: {
        // prefix: row.slug.split('/')[0],
        // slug: row.slug.split('/')[1]
        prefix: BLOG.POST_SUB_PATH,
        slug: row.slug
      }
    }));

  return {
    paths: paths,
    fallback: true
  };
}

export async function getStaticProps({ params: { prefix, slug } }) {
  const fullSlug = `${prefix}/${slug}`;

  const from = `slug-props-${fullSlug}`;
  const props = await getGlobalData({ from });

  // 在数据库列表内查找文章
  props.post = props?.allPages?.find((p) => {
    return p.slug.toLowerCase() === slug.toLowerCase();
  });

  // 处理非数据库文章的信息 -> 是否为子页面
  if (!props?.post && slug.length >= 32) {
    const post = await getNotionPost(slug);
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

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export default PrefixSlug;
