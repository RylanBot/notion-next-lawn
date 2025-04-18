import { getTextContent } from 'notion-utils';

const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2
};

const indentLevelStack = [
  {
    actual: -1,
    effective: -1
  }
];

/**
 * @see https://github.com/NotionX/react-notion-x/blob/master/packages/notion-utils/src/get-page-table-of-contents.ts
 * Gets the metadata for a table of contents block by parsing the page's
 * H1, H2, and H3 elements.
 */
export const getPageTableOfContents = (page, recordMap) => {
  const contents = page.content ?? [];
  const toc = getBlockHeader(contents, recordMap);

  // Adjust indent levels to always change smoothly.
  // This is a little tricky, but the key is that when increasing indent levels,
  // they should never jump more than one at a time.
  for (const tocItem of toc) {
    const { indentLevel } = tocItem;
    const actual = indentLevel;

    do {
      const prevIndent = indentLevelStack[indentLevelStack.length - 1];
      const { actual: prevActual, effective: prevEffective } = prevIndent;

      if (actual > prevActual) {
        tocItem.indentLevel = prevEffective + 1;
        indentLevelStack.push({
          actual,
          effective: tocItem.indentLevel
        });
      } else if (actual === prevActual) {
        tocItem.indentLevel = prevEffective;
        break;
      } else {
        indentLevelStack.pop();
      }
    } while (true);
  }

  return toc;
};

/**
 * 重写获取目录方法
 */
function getBlockHeader(contents, recordMap, toc) {
  if (!toc) toc = [];
  if (!contents) return toc;

  for (const blockId of contents) {
    const block = recordMap.block[blockId]?.value;
    if (!block) continue;
    const { type } = block;

    if (type.indexOf('header') >= 0) {
      const existed = toc.find((e) => e.id === blockId);
      if (!existed) {
        toc.push({
          id: blockId,
          type,
          text: getTextContent(block.properties?.title),
          // text: getBlockHeaderContent(block.properties?.title[0]),
          indentLevel: indentLevels[type]
        });
      }
    }

    if (block.content?.length > 0) {
      getBlockHeader(block.content, recordMap, toc);
    }
  }

  return toc;
}

/**
 * To fix: 无法渲染标题中的公式
 * @param {*} titleArr
 * [ 'Plain Header' ]
 * [ 'Styled Header', [ [ "h", "teal" ] ] ]
 * [ '⁍', [ [ "e", "\\textcolor{teal}{\\small\\text{Katex}}" ] ] ]
 */
function getBlockHeaderContent(titleArr) {
  const title = titleArr[0];

  if (title === '⁍') {
    const katex = titleArr[1][0];
    if (katex[0] === 'e') {
      return katex[1];
    }
  }

  return title;
}
