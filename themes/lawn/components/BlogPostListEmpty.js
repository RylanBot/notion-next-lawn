import useGlobal from '@/hooks/useGlobal';

/**
 * 空白博客列表
 */
const BlogPostListEmpty = ({ currentSearch }) => {
  const { locale } = useGlobal();
  return (
    <div className="flex w-full items-center justify-center py-24 mx-auto">
      <div className=" text-stone-500 dark:text-zinc-400">
        {locale.COMMON.NO_MORE} {currentSearch && <div>{currentSearch}</div>}
      </div>
    </div>
  );
};

export default BlogPostListEmpty;
