const EN_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const ZH_MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

export const parsePostDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(String(dateStr).replace(/\//g, '-'));
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatCardDate = (dateStr) => formatSlashDate(dateStr);

export const formatSlashDate = (dateStr) => {
  if (!dateStr) return '';
  const match = String(dateStr)
    .replace(/\//g, '-')
    .match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return `${match[1]}/${match[2].padStart(2, '0')}/${match[3].padStart(2, '0')}`;
  }
  const date = parsePostDate(dateStr);
  if (!date) return dateStr;
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

export const formatArchiveMonth = (monthIndex, isChinese = true) =>
  (isChinese ? ZH_MONTHS : EN_MONTHS)[monthIndex] || '';

export const formatZhMonth = (monthIndex) => formatArchiveMonth(monthIndex, true);

export const padCount = (count) => String(count ?? 0).padStart(2, '0');
