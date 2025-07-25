import { useEffect, useImperativeHandle, useRef } from 'react';

/**
 * 折叠面板组件，支持水平折叠、垂直折叠
 */
const Collapse = (props) => {
  const { collapseRef } = props;
  const type = props.type || 'vertical';

  const ref = useRef(null);

  useImperativeHandle(collapseRef, () => {
    return {
      /**
       * 当子元素高度变化时，可调用此方法更新折叠组件的高度
       */
      updateCollapseHeight: ({ height, increase }) => {
        ref.current.style.height = ref.current.scrollHeight;
        ref.current.style.height = 'auto';
      }
    };
  });

  /**
   * 折叠
   */
  const collapseSection = (element) => {
    const sectionHeight = element.scrollHeight;
    const sectionWidth = element.scrollWidth;

    requestAnimationFrame(function () {
      switch (type) {
        case 'horizontal':
          element.style.width = sectionWidth + 'px';
          requestAnimationFrame(function () {
            element.style.width = 0 + 'px';
          });
          break;
        case 'vertical':
          element.style.height = sectionHeight + 'px';
          requestAnimationFrame(function () {
            element.style.height = 0 + 'px';
          });
      }
    });
  };

  /**
   * 展开
   */
  const expandSection = (element) => {
    const sectionHeight = element.scrollHeight;
    const sectionWidth = element.scrollWidth;
    let clearTime = 0;
    switch (type) {
      case 'horizontal':
        element.style.width = sectionWidth + 'px';
        clearTime = setTimeout(() => {
          element.style.width = 'auto';
        }, 400);
        break;
      case 'vertical':
        element.style.height = sectionHeight + 'px';
        clearTime = setTimeout(() => {
          element.style.height = 'auto';
        }, 400);
    }

    clearTimeout(clearTime);
  };

  useEffect(() => {
    if (props.isOpen) {
      expandSection(ref.current);
    } else {
      collapseSection(ref.current);
    }
    // 通知父组件高度变化
    props?.onHeightChange && props.onHeightChange({ height: ref.current.scrollHeight, increase: props.isOpen });
  }, [props.isOpen]);

  return (
    <div
      ref={ref}
      className={`${props.className || ''} overflow-hidden duration-200`}
      style={type === 'vertical' ? { height: '0px', willChange: 'height' } : { width: '0px', willChange: 'width' }}
    >
      {props.children}
    </div>
  );
};
Collapse.defaultProps = { isOpen: false };

export default Collapse;
