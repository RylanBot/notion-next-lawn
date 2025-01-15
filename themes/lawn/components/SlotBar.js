/**
 * 博客列表上方嵌入条
 */
const SlotBar = (props) => {
  const { tag, category } = props;

  if (tag || category) {
    return <div className="h-16"></div>;
  }

  return <></>;
};

export default SlotBar;
