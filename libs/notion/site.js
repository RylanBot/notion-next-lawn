import { idToUuid, getDateValue, getTextContent } from 'notion-utils';
import BLOG from '@/blog.config';

import { getPostBlocks, getSingleBlock } from './block';
import { getAllCategories, getCategoryOptions } from './category';
import { compressImage, mapImgUrl } from './image';
import { getAllPageIds } from './page';
import { getPageProperties } from './property';
import { getAllTags, getTagOptions } from './tag';

import { getDataFromCache, setDataToCache } from '../cache';
import { deepClone } from '../common/util';

export async function getGlobalData({ pageId = BLOG.NOTION_PAGE_ID, from }) {
  const data = await getNotionDatabaseCache({ pageId, from });
  const db = deepClone(data);
  // 不返回的敏感数据
  delete db.block;
  delete db.schema;
  delete db.rawMetadata;
  delete db.pageIds;
  delete db.viewIds;
  delete db.collection;
  delete db.collectionQuery;
  delete db.collectionId;
  delete db.collectionView;
  return db;
}

export async function getNotionDatabaseCache({ pageId, from }) {
  // 尝试从缓存获取
  const cacheKey = 'page_block_' + pageId;
  const data = await getDataFromCache(cacheKey);
  if (data && data.pageIds?.length > 0) {
    console.log('[缓存]:', `from:${from}`, `root-page-id:${pageId}`);
    return data;
  }
  const db = await getNotionDatabase({ pageId, from });
  // 存入缓存
  if (db) {
    await setDataToCache(cacheKey, db);
  }
  return db;
}

async function getNotionDatabase({ pageId, from }) {
  const pageRecordMap = await getPostBlocks(pageId, from);
  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', pageId);
    return {};
  }
  pageId = idToUuid(pageId);
  const block = pageRecordMap.block || {};
  const rawMetadata = block[pageId]?.value;
  // Check Type Page-Database和Inline-Database
  if (rawMetadata?.type !== 'collection_view_page' && rawMetadata?.type !== 'collection_view') {
    console.error(`pageId "${pageId}" is not a database`);
    return getEmptyData(pageId);
  }
  const collection = Object.values(pageRecordMap.collection)[0]?.value || {};
  const siteInfo = getSiteInfo({ collection, block });
  const collectionId = rawMetadata?.collection_id;
  const collectionQuery = pageRecordMap.collection_query;
  const collectionView = pageRecordMap.collection_view;
  const schema = collection?.schema;

  const viewIds = rawMetadata?.view_ids;
  const collectionData = [];

  const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds);
  if (pageIds?.length === 0) {
    console.error(
      '获取到的文章列表为空，请检查notion模板',
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      pageRecordMap
    );
  } else {
    console.log('有效Page数量', pageIds?.length);
  }

  // 获取每篇文章基础数据
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i];
    const value = block[id]?.value;
    if (!value) {
      // 如果找不到文章对应的block，说明发生了溢出，使用 pageID 再去请求
      const pageBlock = await getSingleBlock(id, from);
      if (pageBlock.block[id].value) {
        const properties =
          (await getPageProperties(id, pageBlock.block[id].value, schema, null, getTagOptions(schema))) || null;
        if (properties) {
          collectionData.push(properties);
        }
      }
      continue;
    }

    const properties = (await getPageProperties(id, value, schema, null, getTagOptions(schema))) || null;
    if (properties) {
      collectionData.push(properties);
    }
  }

  // 文章计数
  let postCount = 0;

  // 查找所有的Post和Page
  const allPages = collectionData.filter((post) => {
    if (post?.type === 'Post' && post.status === 'Published') {
      postCount++;
    }
    return (
      post &&
      post?.slug &&
      !post?.slug?.startsWith('http') &&
      (post?.status === 'Invisible' || post?.status === 'Published')
    );
  });

  // 站点配置优先读取配置表格，否则读取blog.config.js 文件
  const NOTION_CONFIG = (await getConfigMapFromConfigPage(collectionData)) || {};

  // Sort by date
  if (BLOG.POSTS_SORT_BY === 'date') {
    allPages.sort((a, b) => {
      return b?.publishDate - a?.publishDate;
    });
  }

  const notice = await getNotice(
    collectionData.filter((post) => {
      return post && post?.type && post?.type === 'Notice' && post.status === 'Published';
    })?.[0]
  );
  const categoryOptions = getAllCategories({ allPages, categoryOptions: getCategoryOptions(schema) });
  const tagOptions = getAllTags({ allPages, tagOptions: getTagOptions(schema) });
  // 旧的菜单
  const customNav = getCustomNav({
    allPages: collectionData.filter((post) => post?.type === 'Page' && post.status === 'Published')
  });
  // 新的菜单
  const customMenu = await getCustomMenu({ collectionData });
  const latestPosts = getLatestPosts({ allPages, from, latestPostCount: 4 });
  const allNavPages = getNavPages({ allPages });

  return {
    NOTION_CONFIG,
    notice,
    siteInfo,
    allPages,
    allNavPages,
    collection,
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    block,
    schema,
    tagOptions,
    categoryOptions,
    rawMetadata,
    customNav,
    customMenu,
    postCount,
    pageIds,
    latestPosts
  };
}

async function getConfigMapFromConfigPage(allPages) {
  // 默认返回配置文件
  const notionConfig = {};

  if (!allPages || !Array.isArray(allPages) || allPages.length === 0) {
    console.warn('[Notion配置] 忽略的配置');
    return null;
  }
  const configPage = allPages?.find((post) => {
    return post && post?.type && (post?.type === 'CONFIG' || post?.type === 'config' || post?.type === 'Config');
  });

  if (!configPage) {
    console.warn('[Notion配置] 未找到配置页面');
    return null;
  }
  const configPageId = configPage.id;
  //   console.log('[Notion配置]请求配置数据 ', configPage.id)
  let pageRecordMap = await getPostBlocks(configPageId, 'config-table');
  //   console.log('配置中心Page', configPageId, pageRecordMap)
  let content = pageRecordMap.block[configPageId].value.content;
  for (const table of ['Config-Table', 'CONFIG-TABLE']) {
    if (content) break;
    pageRecordMap = await getPostBlocks(configPageId, table);
    content = pageRecordMap.block[configPageId].value.content;
  }

  if (!content) {
    console.warn(
      '[Notion配置] 未找到配置表格',
      pageRecordMap.block[configPageId],
      pageRecordMap.block[configPageId].value
    );
    return null;
  }

  const configTableId = content?.find((contentId) => {
    return pageRecordMap.block[contentId].value.type === 'collection_view';
  });

  if (!configTableId) {
    console.warn(
      '[Notion配置]未找到配置表格数据',
      pageRecordMap.block[configPageId],
      pageRecordMap.block[configPageId].value
    );
    return null;
  }

  // 页面查找
  const databaseRecordMap = pageRecordMap.block[configTableId];
  const block = pageRecordMap.block || {};
  const rawMetadata = databaseRecordMap.value;
  // Check Type Page-Database和Inline-Database
  if (rawMetadata?.type !== 'collection_view_page' && rawMetadata?.type !== 'collection_view') {
    console.error(`pageId "${configTableId}" is not a database`);
    return null;
  }
  //   console.log('表格', databaseRecordMap, block, rawMetadata)
  const collectionId = rawMetadata?.collection_id;
  const collection = pageRecordMap.collection[collectionId].value;
  const collectionQuery = pageRecordMap.collection_query;
  const collectionView = pageRecordMap.collection_view;
  const schema = collection?.schema;
  const viewIds = rawMetadata?.view_ids;
  const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds);
  if (pageIds?.length === 0) {
    console.error(
      '[Notion配置]获取到的文章列表为空，请检查notion模板',
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      databaseRecordMap
    );
  }
  // 遍历用户的表格
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i];
    const value = block[id]?.value;
    if (!value) {
      continue;
    }
    const rawProperties = Object.entries(block?.[id]?.value?.properties || []);
    const excludeProperties = ['date', 'select', 'multi_select', 'person'];
    const properties = {};
    for (let i = 0; i < rawProperties.length; i++) {
      const [key, val] = rawProperties[i];
      properties.id = id;
      if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
        properties[schema[key].name] = getTextContent(val);
      } else {
        switch (schema[key]?.type) {
          case 'date': {
            const dateProperty = getDateValue(val);
            if (dateProperty) {
              delete dateProperty.type;
              properties[schema[key].name] = dateProperty;
            }
            break;
          }
          case 'select':
          case 'multi_select': {
            const selects = getTextContent(val);
            if (selects[0]?.length) {
              properties[schema[key].name] = selects.split(',');
            }
            break;
          }
          default:
            break;
        }
      }
    }

    if (properties) {
      // 将表格中的字段映射成 英文
      const config = {
        enable: (properties['启用'] || properties.Enable) === 'Yes',
        key: properties['配置名'] || properties.Name,
        value: properties['配置值'] || properties.Value
      };

      // 只导入生效的配置
      if (config.enable) {
        // console.log('[Notion配置]', config.key, config.value)
        notionConfig[config.key] = config.value;
      }
    }
  }

  return notionConfig;
}

function getSiteInfo({ collection, block }) {
  const title = collection?.name?.[0][0] || BLOG.TITLE;
  const description = collection?.description ? Object.assign(collection).description[0][0] : BLOG.DESCRIPTION;
  const pageCover = collection?.cover
    ? mapImgUrl(collection?.cover, block[idToUuid(BLOG.NOTION_PAGE_ID)]?.value)
    : BLOG.HOME_BANNER_IMAGE;
  let icon = collection?.icon ? mapImgUrl(collection?.icon, collection, 'collection') : BLOG.AVATAR;

  // 用户头像压缩一下
  icon = compressImage(icon);

  // 站点图标不能是emoji情
  const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
  if (!icon || emojiPattern.test(icon)) {
    icon = BLOG.AVATAR;
  }
  return { title, description, pageCover, icon };
}

function getEmptyData(pageId) {
  const empty = {
    notice: null,
    siteInfo: getSiteInfo({}),
    allPages: [
      {
        id: 1,
        title: `无法获取Notion数据，请检查Notion_ID： \n 当前 ${pageId}`,
        summary: '访问文档获取帮助→ https://tangly1024.com/article/vercel-deploy-notion-next',
        status: 'Published',
        type: 'Post',
        slug: '13a171332816461db29d50e9f575b00d',
        date: { start_date: '2023-04-24', lastEditedDay: '2023-04-24', tagItems: [] }
      }
    ],
    allNavPages: [],
    collection: [],
    collectionQuery: {},
    collectionId: null,
    collectionView: {},
    viewIds: [],
    block: {},
    schema: {},
    tagOptions: [],
    categoryOptions: [],
    rawMetadata: {},
    customNav: [],
    customMenu: [],
    postCount: 1,
    pageIds: [],
    latestPosts: []
  };
  return empty;
}

function getCustomNav({ allPages }) {
  const customNav = [];
  if (allPages && allPages.length > 0) {
    allPages.forEach((p) => {
      if (p?.slug?.indexOf('http') === 0) {
        customNav.push({ icon: p.icon || null, name: p.title, to: p.slug, target: '_blank', show: true });
      } else {
        customNav.push({ icon: p.icon || null, name: p.title, to: '/' + p.slug, target: '_self', show: true });
      }
    });
  }
  return customNav;
}

function getCustomMenu({ collectionData }) {
  const menuPages = collectionData.filter(
    (post) =>
      (post?.type === BLOG.NOTION_PROPERTY_NAME.type_menu || post?.type === BLOG.NOTION_PROPERTY_NAME.type_sub_menu) &&
      post.status === 'Published'
  );
  const menus = [];
  if (menuPages && menuPages.length > 0) {
    menuPages.forEach((e) => {
      e.show = true;
      if (e?.slug?.indexOf('http') === 0) {
        e.target = '_blank';
      }
      if (e.type === BLOG.NOTION_PROPERTY_NAME.type_menu) {
        menus.push(e);
      } else if (e.type === BLOG.NOTION_PROPERTY_NAME.type_sub_menu) {
        const parentMenu = menus[menus.length - 1];
        if (parentMenu) {
          if (parentMenu.subMenus) {
            parentMenu.subMenus.push(e);
          } else {
            parentMenu.subMenus = [e];
          }
        }
      }
    });
  }
  return menus;
}

function getNavPages({ allPages }) {
  const allNavPages = allPages?.filter((post) => {
    return (
      post && post?.slug && !post?.slug?.startsWith('http') && post?.type === 'Post' && post?.status === 'Published'
    );
  });

  return allNavPages.map((item) => ({
    id: item.id,
    title: item.title || '',
    pageCoverThumbnail: item.pageCoverThumbnail || '',
    category: item.category || null,
    tags: item.tags || null,
    summary: item.summary || null,
    slug: item.slug,
    pageIcon: item.pageIcon || '',
    lastEditedDate: item.lastEditedDate
  }));
}

async function getNotice(post) {
  if (!post) return null;

  post.blockMap = await getPostBlocks(post.id, 'data-notice');
  return post;
}

function getLatestPosts({ allPages, from, latestPostCount }) {
  const allPosts = allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');

  const latestPosts = Object.create(allPosts).sort((a, b) => {
    // const dateA = new Date(a?.lastEditedDate || a?.publishDate)
    // const dateB = new Date(b?.lastEditedDate || b?.publishDate)
    const dateA = new Date(a?.publishDate);
    const dateB = new Date(b?.publishDate);
    return dateB - dateA;
  });
  return latestPosts.slice(0, latestPostCount);
}
