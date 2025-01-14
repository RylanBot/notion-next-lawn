import { idToUuid } from 'notion-utils';

import { getPostBlocks } from './block';
import { getPageCover } from './image';

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
    fullWidth: postInfo?.fullWidth ?? false,
    page_cover: getPageCover(postInfo) ?? '',
    date: { start: '', end: '' },
    blockMap
  };
}
