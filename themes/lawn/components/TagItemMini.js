import Link from 'next/link';

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <Link
      href={`/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={`inline-block rounded duration-200 my-1 mr-2 py-0.5 px-1 text-xs whitespace-nowrap ${
        selected
          ? 'pointer-events-none border-2 border-dotted border-teal-500'
          : `cursor-pointer text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background hover:bg-teal-400 dark:hover:bg-teal-500 dark:hover:text-white hover:text-white`
      }`}
    >
      <div className="font-light">{tag.name + (tag.count ? `(${tag.count})` : '')} </div>
    </Link>
  );
};

export default TagItemMini;
