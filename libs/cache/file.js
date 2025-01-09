import fs from 'fs';

const path = require('path');
const jsonFile = path.resolve('./data.json');

const FILE_CACHE_SECONDS = 1000000000 * 1000;

export async function getCache(key) {
  const exist = await fs.existsSync(jsonFile);
  if (!exist) return null;
  const data = await fs.readFileSync(jsonFile);
  let json = null;
  if (!data) return null;
  try {
    json = JSON.parse(data);
  } catch (error) {
    console.error('读取JSON缓存文件失败', data);
    return null;
  }
  // 缓存超过有效期就作废
  const cacheValidTime = new Date(parseInt(json[key + '_expire_time']) + FILE_CACHE_SECONDS);
  const currentTime = new Date();
  if (!cacheValidTime || cacheValidTime < currentTime) {
    return null;
  }
  return json[key];
}

/**
 * 并发请求写文件异常； Vercel 生产环境不支持写文件。
 */
async function setCache(key, data) {
  const exist = await fs.existsSync(jsonFile);
  const json = exist ? JSON.parse(await fs.readFileSync(jsonFile)) : {};
  json[key] = data;
  json[key + '_expire_time'] = new Date().getTime();
  fs.writeFileSync(jsonFile, JSON.stringify(json));
}

async function delCache(key) {
  const exist = await fs.existsSync(jsonFile);
  const json = exist ? JSON.parse(await fs.readFileSync(jsonFile)) : {};
  delete json.key;
  json[key + '_expire_time'] = new Date().getTime();
  fs.writeFileSync(jsonFile, JSON.stringify(json));
}

export async function cleanCache() {
  const json = {};
  fs.writeFileSync(jsonFile, JSON.stringify(json));
}

export default { getCache, setCache, delCache };
