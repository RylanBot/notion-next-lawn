/**
 * 博客列表上方嵌入条
 */
const SlotBar = (props) => {
  const { visible, tag, category } = props;

  if (!visible && (tag || category)) {
    return <div className="h-16"></div>;
  }

  if (tag || category) {
    return (
      <div className="px-5 py-1 mt-12 mb-2 font-bold dark:text-white">
        <i className={`mr-1 fa-solid ${tag ? 'fa-hashtag' : 'fa-folder-closed'}`} />
        {tag || category}
      </div>
    );
  }

  return <></>;
};

export default SlotBar;
