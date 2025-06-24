import { isIterable } from '../common/util';

export function getAllCategories({ allPages, categoryOptions, sliceCount = 0 }) {
  const allPosts = allPages?.filter((page) => page.type === 'Post' && page.status === 'Published');
  if (!allPosts || !categoryOptions) return [];

  let categories = allPosts?.map((p) => p.category);
  categories = [...categories.flat()];
  const categoryObj = {};
  categories.forEach((category) => {
    if (category in categoryObj) {
      categoryObj[category]++;
    } else {
      categoryObj[category] = 1;
    }
  });

  const list = [];
  if (isIterable(categoryOptions)) {
    for (const c of categoryOptions) {
      const count = categoryObj[c.value];
      if (count) {
        list.push({ id: c.id, name: c.value, color: c.color, count });
      }
    }
  }

  // 按照数量排序
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount);
  } else {
    return list;
  }
}

export function getCategoryOptions(schema) {
  if (!schema) return {};
  const categorySchema = Object.values(schema).find((e) => e.name === 'category');
  return categorySchema?.options || [];
}
