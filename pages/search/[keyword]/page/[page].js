import { useRouter } from 'next/router';

import BLOG from '@/blog.config';
import { getLayoutByTheme } from '@/themes';

import { getDataFromCache } from '@/libs/cache';
import { siteConfig } from '@/libs/common/config';
import { isIterable } from '@/libs/common/util';
import { getGlobalData } from '@/libs/notion/site';

const Index = (props) => {
  const { keyword } = props;
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() });
  props = { ...props, currentSearch: keyword };
  return <Layout {...props} />;
};

export async function getStaticProps({ params: { keyword, page } }) {
  const props = await getGlobalData({
    from: 'search-props',
    pageType: ['Post']
  });
  const { allPages } = props;
  const allPosts = allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');
  props.posts = await filterByMemCache(allPosts, keyword);
  props.postCount = props.posts.length;
  // 处理分页
  props.posts = props.posts.slice(BLOG.POSTS_PER_PAGE * (page - 1), BLOG.POSTS_PER_PAGE * page);
  props.keyword = keyword;
  props.page = page;
  delete props.allPages;
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { keyword: BLOG.TITLE, page: '1' } }],
    fallback: true
  };
}

/**
 * 将对象的指定字段拼接到字符串
 */
function appendText(sourceTextArray, targetObj, key) {
  if (!targetObj) {
    return sourceTextArray;
  }
  const textArray = targetObj[key];
  const text = textArray ? getTextContent(textArray) : '';
  if (text && text !== 'Untitled') {
    return sourceTextArray.concat(text);
  }
  return sourceTextArray;
}

/**
 * 递归获取层层嵌套的数组
 */
function getTextContent(textArray) {
  if (typeof textArray === 'object' && isIterable(textArray)) {
    let result = '';
    for (const textObj of textArray) {
      result = result + getTextContent(textObj);
    }
    return result;
  } else if (typeof textArray === 'string') {
    return textArray;
  }
}

/**
 * 在内存缓存中进行全文索引
 */
async function filterByMemCache(allPosts, keyword) {
  const filterPosts = [];
  if (keyword) {
    keyword = keyword.trim();
  }
  for (const post of allPosts) {
    const cacheKey = 'page_block_' + post.id;
    const page = await getDataFromCache(cacheKey, true);
    const tagContent = post?.tags && Array.isArray(post?.tags) ? post?.tags.join(' ') : '';
    const categoryContent = post.category && Array.isArray(post.category) ? post.category.join(' ') : '';
    const articleInfo = post.title + post.summary + tagContent + categoryContent;
    let hit = articleInfo.indexOf(keyword) > -1;
    let indexContent = [post.summary];
    if (page && page.block) {
      const contentIds = Object.keys(page.block);
      contentIds.forEach((id) => {
        const properties = page?.block[id]?.value?.properties;
        indexContent = appendText(indexContent, properties, 'title');
        indexContent = appendText(indexContent, properties, 'caption');
      });
    }
    // console.log('全文搜索缓存', cacheKey, page != null)
    post.results = [];
    let hitCount = 0;
    for (const i in indexContent) {
      const c = indexContent[i];
      if (!c) {
        continue;
      }
      const index = c.toLowerCase().indexOf(keyword.toLowerCase());
      if (index > -1) {
        hit = true;
        hitCount += 1;
        post.results.push(c);
      } else {
        if ((post.results.length - 1) / hitCount < 3 || i === 0) {
          post.results.push(c);
        }
      }
    }
    if (hit) {
      filterPosts.push(post);
    }
  }
  return filterPosts;
}

export default Index;
