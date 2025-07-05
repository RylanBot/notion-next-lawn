import { useRouter } from 'next/router';

import useGlobal from '@/hooks/useGlobal';
import { formatNameToSlug } from '@/libs/common/util';

import Card from './Card';
import CategoryMini from './CategoryMini';

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

        <div className="flex flex-col mx-4 dark:border-gray-600 ">
          {categoryOptions.map((category) => {
            const selected = currentCategory === formatNameToSlug(category.name);
            return (
              <CategoryMini
                key={category.name}
                name={category.name}
                count={category.count}
                icon={`mr-2 fas ${selected ? 'fa-folder-open text-teal-500' : 'fa-folder'}`}
                className={`text-sm w-full items-center my-0.5 px-2 py-1 font-light rounded-md ${
                  selected
                    ? 'pointer-events-none border-2 border-dotted border-teal-500'
                    : 'dark:text-gray-300 text-gray-800 hover:text-white dark:hover:text-white hover:bg-teal-400 dark:hover:bg-teal-500'
                }`}
              />
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default CategoryGroup;
