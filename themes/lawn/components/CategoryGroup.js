import Link from 'next/link';
import { useRouter } from 'next/router';

import { useGlobal } from '@/hooks/useGlobal';
import Card from './Card';

const CategoryGroup = () => {
  const { categoryOptions, locale } = useGlobal();
  const router = useRouter();
  const currentCategory = router.query.category;

  if (!categoryOptions) return;

  return (
    <>
      <Card className="my-4">
        <div className="ml-2 mb-1 ">
          <i className="fa-solid fa-layer-group" /> {locale.COMMON.CATEGORY}
        </div>

        <div id="category-list" className="dark:border-gray-600 flex flex-wrap mx-4">
          {categoryOptions.map((category) => {
            const selected = currentCategory === category.name;
            return (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                className={`text-sm w-full items-center my-0.5 px-2 py-1 font-light rounded-md ${
                  selected
                    ? 'pointer-events-none border-2 border-dotted border-teal-500'
                    : 'dark:text-gray-300 text-gray-800 hover:text-white dark:hover:text-white hover:bg-teal-400 dark:hover:bg-teal-500'
                }`}
              >
                <div>
                  <i className={`mr-2 fas ${selected ? 'fa-folder-open text-teal-500' : 'fa-folder'}`} />
                  {category.name}({category.count})
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default CategoryGroup;
