import { idToUuid } from 'notion-utils';
import BLOG from '@/blog.config';

import { getPageCover } from './image';
import { getPostBlocks } from './block';

import { formatDate } from '../common/date';

/**
 * 这个函数不能和其它代码放在一个文件
 * 否则容易造成「服务端和客户端混合编译」而报错
 */
export async function getNotionPost(postId) {
  const blockMap = await getPostBlocks(postId, 'slug');
  if (!blockMap) return null;

  const postInfo = blockMap?.block?.[idToUuid(postId)].value;
  return {
    id: postId,
    type: postInfo,
    category: '',
    tags: [],
    title: postInfo?.properties?.title?.[0],
    status: 'Published',
    createdTime: formatDate(new Date(postInfo.created_time).toString(), BLOG.LANG),
    lastEditedDay: formatDate(new Date(postInfo?.last_edited_time).toString(), BLOG.LANG),
    fullWidth: postInfo?.fullWidth,
    page_cover: getPageCover(postInfo),
    date: { start_date: formatDate(new Date(postInfo?.last_edited_time).toString(), BLOG.LANG) },
    finished_date: formatDate(new Date(postInfo?.finished_date).toString(), BLOG.LANG),
    blockMap
  };
}
