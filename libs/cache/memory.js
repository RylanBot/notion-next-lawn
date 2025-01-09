import cache from 'memory-cache';
import BLOG from '@/blog.config';

const MEMORY_CACHE_TIME = BLOG.isProd ? 10 * 60 : 120 * 60; // 120 minutes for dev,10 minutes for prod

async function getCache(key) {
  return await cache.get(key);
}

async function setCache(key, data) {
  await cache.put(key, data, MEMORY_CACHE_TIME * 1000);
}

async function delCache(key) {
  await cache.del(key);
}

export default { getCache, setCache, delCache };
