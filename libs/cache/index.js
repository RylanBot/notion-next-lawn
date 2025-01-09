import BLOG from '@/blog.config';

import FileCache from './file';
import MemoryCache from './memory';
import MongoCache from './mongo';

/**
 * 为减少频繁接口请求，notion 数据将被缓存
 */
export async function getDataFromCache(key, force) {
  if (JSON.parse(BLOG.ENABLE_CACHE) || force) {
    const dataFromCache = await getApi().getCache(key);
    if (JSON.stringify(dataFromCache) === '[]') {
      return null;
    }
    return getApi().getCache(key);
  } else {
    return null;
  }
}

export async function setDataToCache(key, data) {
  if (!data) {
    return;
  }
  await getApi().setCache(key, data);
}

export async function delCacheData(key) {
  if (!JSON.parse(BLOG.ENABLE_CACHE)) {
    return;
  }
  await getApi().delCache(key);
}

function getApi() {
  if (process.env.MONGO_DB_URL && process.env.MONGO_DB_NAME) {
    return MongoCache;
  } else if (process.env.ENABLE_FILE_CACHE) {
    return FileCache;
  } else {
    return MemoryCache;
  }
}
