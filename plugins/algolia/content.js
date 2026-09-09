import { isIterable } from '@/libs/common/util';

function appendText(sourceTextArray, targetObj, key) {
  if (!targetObj) {
    return sourceTextArray;
  }
  const textArray = targetObj[key];
  const text = textArray ? getTextContent(textArray) : '';
  if (text && text !== 'Untitled') {
    return sourceTextArray.concat(text);
  }
  return sourceTextArray;
}

function getTextContent(textArray) {
  if (typeof textArray === 'object' && isIterable(textArray)) {
    let result = '';
    for (const textObj of textArray) {
      result = result + getTextContent(textObj);
    }
    return result;
  } else if (typeof textArray === 'string') {
    return textArray;
  }
}

export function getPageContentText(post, pageBlockMap) {
  let indexContent = [];
  if (pageBlockMap && pageBlockMap.block && !post.password) {
    const contentIds = Object.keys(pageBlockMap.block);
    contentIds.forEach((id) => {
      const properties = pageBlockMap?.block[id]?.value?.properties;
      indexContent = appendText(indexContent, properties, 'title');
      indexContent = appendText(indexContent, properties, 'caption');
    });
  }
  return indexContent.join('');
}
