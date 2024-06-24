/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function SlotBar(props) {
  const { tag, category } = props;

  if (tag) {
    return (
      <div className="px-5 py-1 mt-12 mb-2 font-bold dark:text-white">
        <i className="mr-1 fa-solid fa-hashtag" /> {tag}
      </div>
    );
  } else if (category) {
    return (
      <div className="px-5 py-1 mt-12 mb-2 font-bold dark:text-white">
        <i className="mr-1 far fa-folder-open" /> {category}
      </div>
    );
  }

  return <></>;
}
