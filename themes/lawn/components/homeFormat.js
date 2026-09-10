export const parsePostDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(String(dateStr).replace(/\//g, '-'));
  return Number.isNaN(date.getTime()) ? null : date;
};

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
