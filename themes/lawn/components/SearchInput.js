import { useRouter } from 'next/router';
import { useImperativeHandle, useRef, useState } from 'react';

import { useGlobal } from '@/hooks/useGlobal';

let lock = false;

const SearchInput = (props) => {
  const { currentSearch, ref } = props;
  const { locale } = useGlobal();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef();

  useImperativeHandle(ref, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus();
      }
    };
  });

  const handleSearch = () => {
    const key = searchInputRef.current.value;
    if (key && key !== '') {
      setLoading(true);
      router.push({ pathname: '/search/' + key }).then((r) => {
        setLoading(false);
      });
      // location.href = '/search/' + key
    } else {
      router.push({ pathname: '/' }).then((r) => {});
    }
  };
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      // 回车
      handleSearch(searchInputRef.current.value);
    } else if (e.keyCode === 27) {
      // ESC
      cleanSearch();
    }
  };
  const cleanSearch = () => {
    searchInputRef.current.value = '';
  };

  const [showClean, setShowClean] = useState(false);
  const updateSearchKey = (val) => {
    if (lock) {
      return;
    }
    searchInputRef.current.value = val;

    if (val) {
      setShowClean(true);
    } else {
      setShowClean(false);
    }
  };
  function lockSearchInput() {
    lock = true;
  }

  function unLockSearchInput() {
    lock = false;
  }

  return (
    <div className="flex w-full rounded-lg">
      <input
        ref={searchInputRef}
        type="text"
        className="outline-none w-full text-sm pl-5 rounded-lg transition focus:shadow-lg dark:text-gray-300 font-light leading-10 text-black border-2 border-teal-500"
        onKeyUp={handleKeyUp}
        onCompositionStart={lockSearchInput}
        onCompositionUpdate={lockSearchInput}
        onCompositionEnd={unLockSearchInput}
        placeholder={locale.SEARCH.ARTICLES}
        onChange={(e) => updateSearchKey(e.target.value)}
        defaultValue={currentSearch || ''}
      />

      <div className="-ml-8 cursor-pointer float-right items-center justify-center py-2" onClick={handleSearch}>
        <i
          className={`hover:text-black transform duration-200 text-gray-500 dark:text-gray-200 cursor-pointer fas ${
            loading ? 'fa-spinner animate-spin' : 'fa-search'
          }`}
        />
      </div>

      {showClean && (
        <div className="-ml-12 cursor-pointer float-right items-center justify-center py-2">
          <i
            className="hover:text-black transform duration-200 text-gray-400 dark:text-gray-300 cursor-pointer fas fa-times"
            onClick={cleanSearch}
          />
        </div>
      )}
    </div>
  );
};

export default SearchInput;
