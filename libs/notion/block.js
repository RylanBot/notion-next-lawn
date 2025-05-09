import { NotionAPI } from 'notion-client';
import BLOG from '@/blog.config';

import { getDataFromCache, setDataToCache } from '../cache';
import { deepClone, delay } from '../common/util';

export async function getPostBlocks(id, from, slice) {
  const cacheKey = 'page_block_' + id;
  let pageBlock = await getDataFromCache(cacheKey);
  if (pageBlock) {
    console.log('[缓存]:', `from:${from}`, cacheKey);
    return filterPostBlocks(id, pageBlock, slice);
  }

  const start = new Date().getTime();
  pageBlock = await getBlockWithRetry(id, from);
  const end = new Date().getTime();
  console.log('[API耗时]', `${end - start}ms`);

  if (pageBlock) {
    await setDataToCache(cacheKey, pageBlock);
    return filterPostBlocks(id, pageBlock, slice);
  }
  return pageBlock;
}

export async function getSingleBlock(id, from) {
  const cacheKey = 'single_block_' + id;
  let pageBlock = await getDataFromCache(cacheKey);
  if (pageBlock) {
    console.log('[缓存]:', `from:${from}`, cacheKey);
    return pageBlock;
  }

  const start = new Date().getTime();
  pageBlock = await getBlockWithRetry(id, from);
  const end = new Date().getTime();
  console.log('[API耗时]', `${end - start}ms`);

  if (pageBlock) {
    await setDataToCache(cacheKey, pageBlock);
  }
  return pageBlock;
}

async function getBlockWithRetry(id, from, retryAttempts = 3) {
  if (retryAttempts && retryAttempts > 0) {
    console.log('[请求API]', `from:${from}`, `id:${id}`, retryAttempts < 3 ? `剩余重试次数:${retryAttempts}` : '');
    try {
      const authToken = BLOG.NOTION_ACCESS_TOKEN || null;
      const api = new NotionAPI({ authToken, userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      const pageData = await api.getPage(id);
      // console.log('stringfy', JSON.stringify(pageData))
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
      return await getBlockWithRetry(id, from, retryAttempts - 1);
    }
  } else {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`);
    return null;
  }
}

/**
 * 获取到的页面BLOCK特殊处理
 * 1.删除冗余字段
 * 2.比如文件、视频、音频、url格式化
 * 3.代码块等元素兼容
 */
function filterPostBlocks(id, pageBlock, slice) {
  const clonePageBlock = deepClone(pageBlock);
  let count = 0;

  // 循环遍历文档的每个block
  for (const i in clonePageBlock?.block) {
    const b = clonePageBlock?.block[i];
    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock?.block[i];
      continue;
    }
    // 当BlockId等于PageId时移除
    if (b?.value?.id === id) {
      // 此block含有敏感信息
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
