import { NotionAPI } from 'notion-client';

import BLOG from '@/blog.config';
import { getDataFromCache, setDataToCache } from '../cache';
import { deepClone, delay } from '../common/util';

export async function getPostBlocks(id, from, slice) {
  const cacheKey = `page_block_${id}`;
  const cachedBlock = await getDataFromCache(cacheKey);
  if (cachedBlock) {
    console.log('[缓存]:', `from:${from}`, cacheKey);
    return cachedBlock;
  }

  const start = Date.now();

  let pageBlock = await getBlocksWithRetry(id, from);
  pageBlock = unwrapBlocks(pageBlock);
  pageBlock = filterPostBlocks(id, pageBlock, slice);

  const end = Date.now();
  console.log('[API耗时]', `${end - start}ms`);

  await setDataToCache(cacheKey, pageBlock);

  return pageBlock;
}

export async function getSingleBlock(id, from) {
  const cacheKey = 'single_block_' + id;
  const cachedBlock = await getDataFromCache(cacheKey);
  if (cachedBlock) {
    console.log('[缓存]:', `from:${from}`, cacheKey);
    return cachedBlock;
  }

  const start = Date.now();

  const pageBlock = await getBlocksWithRetry(id, from);
  pageBlock = unwrapBlocks(pageBlock);

  const end = Date.now();
  console.log('[API耗时]', `${end - start}ms`);

  if (pageBlock) {
    await setDataToCache(cacheKey, pageBlock);
  }
  return pageBlock;
}

async function getBlocksWithRetry(id, from, retryAttempts = 3) {
  if (retryAttempts && retryAttempts > 0) {
    console.log('[请求API]', `from:${from}`, `id:${id}`, retryAttempts < 3 ? `剩余重试次数:${retryAttempts}` : '');
    try {
      const api = new NotionAPI({
        apiBaseUrl: BLOG.NOTION_API_BASE_URL || 'https://www.notion.so/api/v3',
        authToken: BLOG.NOTION_ACCESS_TOKEN || null,
        userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        kyOptions: {
          mode: 'cors',
          hooks: {
            beforeRequest: [
              (request) => {
                const url = request.url.toString();
                if (url.includes('/api/v3/syncRecordValues')) {
                  return new Request(url.replace('/api/v3/syncRecordValues', '/api/v3/syncRecordValuesMain'), request);
                }
                return request;
              }
            ]
          }
        }
      });
      const pageData = await api.getPage(id);
      console.info('[响应成功]:', `from:${from}`);
      return pageData;
    } catch (e) {
      console.warn('[响应异常]:', e);
      await delay(1000);
      const cacheKey = 'page_block_' + id;
      const pageBlock = await getDataFromCache(cacheKey);
      if (pageBlock) {
        console.log('[重试缓存]', `from:${from}`, `id:${id}`);
        return pageBlock;
      }
      return await getBlocksWithRetry(id, from, retryAttempts - 1);
    }
  } else {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`);
    return null;
  }
}

/**
 * 强制解包 Notion 数据格式为旧版
 * - 旧版：block: { id: { value: {...} } }
 * - 新版：block: { spaceId: { id: { value: {...} } } }
 */
function unwrapBlocks(recordMap) {
  if (!recordMap) return recordMap;

  const unwrapValue = (obj) => {
    let cur = obj;
    let guard = 0;
    // 最多 5 层防止异常循环
    while (cur?.value && typeof cur.value === 'object' && guard < 5) {
      cur = cur.value;
      guard++;
    }
    return cur;
  };

  const block = {};
  const collection = {};

  for (const [id, item] of Object.entries(recordMap.block || {})) {
    block[id] = { value: unwrapValue(item) };
  }

  for (const [id, item] of Object.entries(recordMap.collection || {})) {
    collection[id] = { value: unwrapValue(item) };
  }

  return {
    ...recordMap,
    block,
    collection
  };
}

/**
 * 特殊处理获取到的页面数据
 * 1. 删除冗余字段
 * 2. 比如文件、视频、音频、url格式化
 * 3. 代码块等元素兼容
 */
function filterPostBlocks(id, recordMap, slice) {
  const clonePageBlock = deepClone(recordMap);
  let count = 0;

  // 循环遍历文档的每个 block
  for (const i in clonePageBlock?.block) {
    const b = clonePageBlock?.block[i];
    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock?.block[i];
      continue;
    }
    // 当 BlockId 等于 PageId 时移除
    if (b?.value?.id === id) {
      // 此 block 含有敏感信息
      delete b?.value?.properties;
      continue;
    }

    count++;
    // 处理 c++、c#、汇编等语言名字映射
    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp';
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp';
      }
      if (b?.value?.properties?.language?.[0][0] === 'Assembly') {
        b.value.properties.language[0][0] = 'asm6502';
      }
    }

    // 如果是文件，或嵌入式PDF，需要重新加密签名
    if (
      (b?.value?.type === 'file' ||
        b?.value?.type === 'pdf' ||
        b?.value?.type === 'video' ||
        b?.value?.type === 'audio') &&
      b?.value?.properties?.source?.[0][0] &&
      b?.value?.properties?.source?.[0][0].indexOf('amazonaws.com') > 0
    ) {
      const oldUrl = b?.value?.properties?.source?.[0][0];
      const newUrl = `https://notion.so/signed/${encodeURIComponent(oldUrl)}?table=block&id=${b?.value?.id}`;
      b.value.properties.source[0][0] = newUrl;
    }

    delete b?.role;
    delete b?.value?.version;
    delete b?.value?.created_by_table;
    delete b?.value?.created_by_id;
    delete b?.value?.last_edited_by_table;
    delete b?.value?.last_edited_by_id;
    delete b?.value?.space_id;
  }

  // 去掉不用的字段
  if (id === BLOG.NOTION_PAGE_ID) {
    return clonePageBlock;
  }
  return clonePageBlock;
}
