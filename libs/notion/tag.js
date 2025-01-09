import BLOG from '@/blog.config';
import { isIterable } from '../common/util';

export function getAllTags({ allPages, sliceCount = 0, tagOptions }) {
  const allPosts = allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');

  if (!allPosts || !tagOptions) {
    return [];
  }
  // 计数
  let tags = allPosts?.map((p) => p.tags);
  tags = [...tags.flat()];
  const tagObj = {};
  tags.forEach((tag) => {
    if (tag in tagObj) {
      tagObj[tag]++;
    } else {
      tagObj[tag] = 1;
    }
  });
  const list = [];
  if (isIterable(tagOptions)) {
    tagOptions.forEach((c) => {
      const count = tagObj[c.value];
      if (count) {
        list.push({ id: c.id, name: c.value, color: c.color, count });
      }
    });
  }

  // 按照数量排序
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount);
  } else {
    return list;
  }
}

export function getTagOptions(schema) {
  if (!schema) return {};
  const tagSchema = Object.values(schema).find((e) => e.name === BLOG.NOTION_PROPERTY_NAME.tags);
  return tagSchema?.options || [];
}
