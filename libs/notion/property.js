import { getDateValue, getTextContent } from 'notion-utils';
import { mapImgUrl } from './image';

/**
 * 提取数据库表格参数
 */
export const getDatabaseProperties = (schema, rawProperties) => {
  const properties = {};

  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i];
    switch (schema[key]?.type) {
      case 'text':
      case 'title':
      case 'checkbox':
        properties[schema[key].name] = getTextContent(val);
        break;
      case 'date':
      case 'daterange': {
        const dateProperty = getDateValue(val);
        if (dateProperty) {
          properties[schema[key].name] = dateProperty;
        }
        break;
      }
      case 'select': {
        const selects = getTextContent(val);
        if (selects.length) {
          properties[schema[key].name] = selects.split(',')[0]; // 只提取第一个值
        }
        break;
      }
      case 'multi_select': {
        const selects = getTextContent(val);
        if (selects.length) {
          properties[schema[key].name] = selects.split(','); // 提取所有值
        }
        break;
      }
      default:
        break;
    }
  }

  return properties;
};

/**
 * 获取页面元素成员属性
 */
export const getPageProperties = async (id, value, schema, tagOptions) => {
  const rawProperties = Object.entries(value?.properties || []);
  const properties = getDatabaseProperties(schema, rawProperties);

  /*
    生成的 properties 结构类似
    {
      category: '',
      date: { start_date: 'xxxx-xx-xx', end_date: 'xxxx-xx-xx' },
      slug: '',
      tags: [ '', '' ],
      type: '' ,
      title: '',
      summary: '',
      status: ''
    }
   */

  /* 格式化参数 */
  properties.date = {
    start: String(properties.date?.start_date ?? value.created_time).replace(/-/g, '/'),
    end: String(properties.date?.end_date ?? '').replace(/-/g, '/')
  };

  /* 补充额外的参数 */
  properties.id = id;
  properties.fullWidth = value.format?.page_full_width ?? false;
  properties.pageIcon = mapImgUrl(value?.format?.page_icon, value) ?? '';
  properties.pageCover = mapImgUrl(value?.format?.page_cover, value) ?? '';
  properties.pageCoverThumbnail = mapImgUrl(value?.format?.page_cover, value, 'block', 'pageCoverThumbnail') ?? '';

  properties.tagItems =
    properties?.tags?.map((tag) => {
      return { name: tag, color: tagOptions?.find((t) => t.value === tag)?.color || 'gray' };
    }) || [];

  // 处理 URL
  if (properties.type === 'Post' || properties.type === 'Page') {
    properties.slug = properties.slug ?? properties.id;
  } else if (properties.type === 'Menu' || properties.type === 'SubMenu') {
    // 菜单路径为空、作为可展开菜单使用
    properties.to = properties.slug ?? '#';
    properties.name = properties.title ?? '';
  }

  return properties;
};
