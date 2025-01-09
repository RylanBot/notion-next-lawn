import { cleanCache } from '@/libs/cache/file';

/**
 * 清理缓存
 */
export default async function handler(req, res) {
  try {
    await cleanCache();
    res.status(200).json({ status: 'success', message: 'Clean cache successful!' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Clean cache failed!', error });
  }
}
