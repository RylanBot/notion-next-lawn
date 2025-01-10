import { useEffect, useRef } from 'react';
import SearchInput from './SearchInput';

/**
 * 搜索页面的导航
 */
const SearchNav = (props) => {
  const searchRef = useRef(null);

  useEffect(() => {
    // 自动聚焦到搜索框
    searchRef?.current?.focus();
  }, []);

  return (
    <>
      <div className="my-6 px-2">
        <SearchInput ref={searchRef} {...props} />
      </div>
    </>
  );
};

export default SearchNav;
